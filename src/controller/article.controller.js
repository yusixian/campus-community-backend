/*
 * @Author: cos
 * @Date: 2022-02-18 14:15:27
 * @LastEditTime: 2022-03-01 17:57:01
 * @LastEditors: cos
 * @Description: 文章相关控制器
 * @FilePath: \campus-community-backend\src\controller\article.controller.js
 */
const path = require('path')
const { createArticle, deleteArticleByID, updateArticleByID, getArticleList, restoreArticleByID, searchArticleByID, filterArticle, countArticle, incrementVisitsByID} = require('../service/article.service')
const { articleOperationError, articleCreateError, 
    articleDeleteError, articleParamsError, 
    articleDosNotExist, articleUpdateError, 
    articleShieldError, articleRestoreError, fileUploadError
} = require('../constant/err.type');

class ArticleController {
  /**
   * @description: 发表文章
   */
  async postArticle(ctx, next) {
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
  async deleteArticle(ctx, next) {
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
  async shieldArticle(ctx, next) {
    try {
      await updateArticleByID(ctx.state.article_id, {status: 1})
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
  async restoreArticle(ctx, next) {
    try {
      const id = ctx.state.article_id
      console.log(ctx.request.query.isDel)
      const isDel = parseInt(ctx.request.query.isDel) === 1;
      const res = await searchArticleByID(id, true, isDel)
      // console.log(`searchID ${article_id}:`, res);
      if(!res) {
        return ctx.app.emit('error', articleDosNotExist, ctx);
      }
      if(res.status === 0) throw Error('该文章未被屏蔽')
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
  async updateArticle(ctx, next) {
    const { article_id, title, content, summary, partition_id, cover_url} = ctx.request.body;
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
      if(!res) return ctx.app.emit('error', articleUpdateError, ctx)
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
  async getAllArticle(ctx, next) {
    try {
      const articleList = await getArticleList()
      console.log("articleList type:", typeof articleList)
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
   * @description:根据id获取文章
   */
  async getByID(ctx, next) {
    try {
      const article_id = ctx.state.article_id
      await searchArticleByID(article_id, true)
      const res = await incrementVisitsByID(article_id)
      const article = ctx.state.article
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
   async getByPages(ctx, next) {
    try {
      const filterOpt = ctx.state.filterOpt
      // console.log("filterOpt:", filterOpt)
      const res = await filterArticle(filterOpt)
      const article_pages = res.page_nums
      const article_total = res.count
      const article_list = res.rows
      const result = { article_total , article_pages, article_list }
      console.log(result)
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
   async countByFilter(ctx, next) {
    try {
      const filterOpt = ctx.state.filterOpt
      console.log("filterOpt:", filterOpt)
      const count = await countArticle(filterOpt)
      console.log("count: ",count)
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
      if(Array.isArray(file)) {
        // console.log("img!")
        file.forEach(element => {
          let img = '/uploads/' + path.basename(element.path)
          imgPaths.push(img)
        });
      } else {
        // console.log("file",file)
        let img = '/uploads/' + path.basename(file.path)
        // console.log("img!", img)
        imgPaths.push(img)
      }
      // console.log(imgPaths)
      ctx.body = {
        code: 0,
        message: '文章图片上传成功',
        result: {
          imgPaths
        }
      }
    } catch(err) {
      console.log(err)
      return ctx.app.emit('error', fileUploadError, ctx)
    }
  }

  /**
   * @description: 根据过滤参数分页获取文章
   */
   async getByPublicPages(ctx, next) {
    try {
      const filterOpt = ctx.state.filterOpt
      filterOpt.status = 0
      console.log("filterOpt:", filterOpt)
      const res = await filterArticle(filterOpt)
      const article_pages = res.page_nums
      const article_total = res.count
      const article_list = res.rows
      const result = { article_total , article_pages, article_list }
      console.log(result)
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
}

module.exports = new ArticleController()