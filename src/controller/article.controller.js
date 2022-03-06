/*
 * @Author: cos
 * @Date: 2022-02-18 14:15:27
 * @LastEditTime: 2022-03-06 12:53:28
 * @LastEditors: cos
 * @Description: 文章相关控制器
 * @FilePath: \campus-community-backend\src\controller\article.controller.js
 */
const path = require('path')
const { createArticle, deleteArticleByID, updateArticleByID, getArticleList, restoreArticleByID, searchArticleByID, filterArticle, countArticle, incrementVisitsByID, reviewArticleByID } = require('../service/article.service')
const { getUserInfo } = require('../service/user.service')
const { articleOperationError, articleCreateError,
  articleDeleteError, articleParamsError,
  articleDosNotExist, articleUpdateError,
  articleShieldError, articleRestoreError, fileUploadError
} = require('../constant/err.type');
const { upToQiniu } = require('../utils/oss/ossUtils');
const { isRepeatLike } = require('../service/like.service');
const { isRepeatCollection } = require('../service/collection.service');

class ArticleController {
  /**
   * @description: 发表文章
   */
  async postArticle (ctx, next) {
    // console.log(ctx.state);
    const { id } = ctx.state.user
    const { summary, cover_url } = ctx.request.body;
    const newArticle = ctx.state.newArticle
    newArticle.user_id = id
    summary && Object.assign(newArticle, { summary })
    cover_url && Object.assign(newArticle, { cover_url })
    // console.log("postArticle:",newArticle)
    try {
      const res = await createArticle(newArticle)
      ctx.body = {
        code: 0,
        message: "发帖成功！",
        result: {
          article_id: res.id,
          user_id: res.user_id,
          partition_id: res.partition_id,
          title: res.title
        }
      }
    } catch (err) {
      console.error('发帖失败！', err);
      ctx.app.emit('error', articleCreateError, ctx)
    }
  }

  /**
   * @description: 删除文章，将status置为2，同时软删除数据库中文章
   */
  async deleteArticle (ctx, next) {
    try {
      await deleteArticleByID(ctx.state.article_id, false)
      ctx.body = {
        code: 0,
        message: "删除文章成功！",
      }
    } catch (err) {
      console.error("删除文章失败！", err);
      return ctx.app.emit('error', articleDeleteError, ctx)
    }
  }

  /**
   * @description: 屏蔽文章，将status置为1
   */
  async shieldArticle (ctx, next) {
    try {
      await updateArticleByID(ctx.state.article_id, { status: 1 })
      ctx.body = {
        code: 0,
        message: "屏蔽该文章成功！",
      }
    } catch (err) {
      console.error(err);
      return ctx.app.emit('error', articleShieldError, ctx)
    }
  }

  /**
   * @description: 恢复被屏蔽/回收站文章 并将status置为0已发布
   */
  async restoreArticle (ctx, next) {
    try {
      const id = ctx.state.article_id
      // console.log(ctx.request.query.isDel)
      const isDel = parseInt(ctx.request.query.isDel) === 1;
      const res = await searchArticleByID(id, true, isDel)
      // console.log(`searchID ${article_id}:`, res);
      if (!res) {
        return ctx.app.emit('error', articleDosNotExist, ctx);
      }
      if (res.status === 0) throw Error('该文章未被屏蔽')
      await restoreArticleByID(id, isDel)
      ctx.body = {
        code: 0,
        message: "恢复该文章成功！",
      }
    } catch (err) {
      console.error("恢复文章失败，该文章可能未被屏蔽");
      return ctx.app.emit('error', articleRestoreError, ctx)
    }
  }

  /**
   * @description: 更新文章
   */
  async updateArticle (ctx, next) {
    const { article_id, title, content, summary, partition_id, cover_url } = ctx.request.body;
    // console.log(id, title, content, summary)
    const newArticle = ctx.state.article
    title && Object.assign(newArticle, { title })
    content && Object.assign(newArticle, { content })
    summary && Object.assign(newArticle, { summary })
    partition_id && Object.assign(newArticle, { partition_id })
    cover_url && Object.assign(newArticle, { cover_url })
    // console.log("newArticle", newArticle)
    try {
      const res = await updateArticleByID(article_id, newArticle)
      if (!res) return ctx.app.emit('error', articleUpdateError, ctx)
      ctx.body = {
        code: 0,
        message: "更新文章成功！",
      }
    } catch (err) {
      console.error('更新文章失败！', err);
      return ctx.app.emit('error', articleUpdateError, ctx)
    }
  }
  /**
   * @description: 获取全部文章（管理员权限）
   */
  async getAllArticle (ctx, next) {
    try {
      const articleList = await getArticleList()
      for (let i = 0; i < articleList.length; i++) {
        // console.log(articleList[i].user_id);
        let id = articleList[i].user_id
        let temp = await getUserInfo({ id })
        articleList[i].name = temp.name
      }
      // console.log("articleList type:", typeof articleList)
      // console.log(articleList)
      ctx.body = {
        code: 0,
        message: "获取文章列表成功！",
        result: articleList
      }
    } catch (err) {
      console.error('获取文章列表失败！', err);
      return ctx.app.emit('error', articleOperationError, ctx)
    }
  }

  /**
   * @description:根据id获取文章 公开的 只能获取已发布文章
   */
  async getByID (ctx, next) {
    try {
      const article_id = ctx.state.article_id
      await searchArticleByID(article_id)
      await incrementVisitsByID(article_id)
      const article = ctx.state.article
      // console.log('user_id', article.user_id);
      let id = article.user_id
      const user = await getUserInfo({ id })
      // console.log('name', user.name);
      article['name'] = user.name

      const isAuth = ctx.state.isAuth
      if(isAuth) {
        const { id: user_id } = ctx.state.user
        article['isLiked'] = await isRepeatLike({ user_id, article_id })
        article['isCollectioned'] = await isRepeatCollection(user_id, article_id)
        // console.log('user_id:',user_id)
      } else {
        // console.log('未登录~')
        article['isLiked'] = false
        article['isCollectioned'] = false
      }
      
      ctx.body = {
        code: 0,
        message: "获取文章成功！",
        result: article
      }
    } catch (err) {
      console.error('获取文章失败！', err);
      return ctx.app.emit('error', articleOperationError, ctx)
    }
  }


  /**
   * @description: (后台)根据过滤参数分页获取文章
   */
  async getByPages (ctx, next) {
    try {
      const filterOpt = ctx.state.filterOpt
      // console.log("filterOpt:", filterOpt)
      const res = await filterArticle(filterOpt)
      const article_pages = res.page_nums
      const article_total = res.count
      const article_list = res.rows
      for (let i = 0; i < article_list.length; i++) {
        // console.log('**********' + article_list[i].user_id);
        let id = article_list[i].user_id
        let temp = await getUserInfo({ id })
        article_list[i]['name'] = temp.name
        // console.log(temp.name);
      }
      const result = { article_total, article_pages, article_list }
      // console.log(result)
      ctx.body = {
        code: 0,
        message: "获取文章成功！",
        result
      }
    } catch (err) {
      console.error('获取文章失败！', err);
      return ctx.app.emit('error', articleOperationError, ctx)
    }
  }

  /**
   * @description: 根据过滤参数获取文章总数
   */
  async countByFilter (ctx, next) {
    try {
      const filterOpt = ctx.state.filterOpt
      // console.log("filterOpt:", filterOpt)
      const count = await countArticle(filterOpt)
      // console.log("count: ", count)
      ctx.body = {
        code: 0,
        message: "获取文章总数",
        result: {
          filterOpt,
          count
        }
      }
    } catch (err) {
      console.error('获取文章失败！', err);
      return ctx.app.emit('error', articleOperationError, ctx)
    }
  }

  // 上传文章图片
  async upload (ctx, next) {
    // console.log(ctx.request.files.file);
    const id = ctx.state.user.id
    const { file } = ctx.request.files
    let imgPaths = []
    try {
      if (!file) throw Error()
      if (Array.isArray(file)) {
        // console.log("img!")
        for(let i in file) {
          // console.log(`file[${i}]: `, file[i])
          const res = await upToQiniu(file[i])
          imgPaths.push(res)
        }
      } else {
        const res = await upToQiniu(file)
        imgPaths.push(res)
      }
      // console.log(imgPaths)
      ctx.body = {
        code: 0,
        message: '文章图片上传成功',
        result: {
          imgPaths
        }
      }
    } catch (err) {
      console.error(err)
      return ctx.app.emit('error', fileUploadError, ctx)
    }
  }

  /**
   * @description: 根据过滤参数分页获取文章
   */
  async getByPublicPages (ctx, next) {
    try {
      const filterOpt = ctx.state.filterOpt
      filterOpt.status = 0
      // console.log("filterOpt:", filterOpt)
      const res = await filterArticle(filterOpt)
      const article_pages = res.page_nums
      const article_total = res.count
      const article_list = res.rows
      for (let i = 0; i < article_list.length; i++) {
        // console.log(article_list[i].user_id);
        let id = article_list[i].user_id
        let temp = await getUserInfo({ id })
        article_list[i]['name'] = temp.name
      }
      const result = { article_total, article_pages, article_list }
      // console.log(result)
      ctx.body = {
        code: 0,
        message: "获取文章成功！",
        result
      }
    } catch (err) {
      console.error('获取文章失败！', err);
      return ctx.app.emit('error', articleOperationError, ctx)
    }
  }
  
  /**
   * @description: 审核文章
   */
   async reviewArticle (ctx, next) {
    try {
      const article_id = ctx.state.article_id
      const pass = ctx.request.body.pass
      await reviewArticleByID(article_id, pass)
      const body = { code: 0 }
      if(pass) body.message = '审核文章通过！已成功发布'
      else body.message = '审核文章未通过，已屏蔽该文章！'
      ctx.body = body
      console.log(`审核文章：article_id = ${article_id} , ' pass = ${pass}\n`, body)
    } catch (err) {
      console.error('审核文章失败！', err);
      return ctx.app.emit('error', articleOperationError, ctx)
    }
  }
}

module.exports = new ArticleController()