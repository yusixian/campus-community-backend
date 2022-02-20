/*
 * @Author: cos
 * @Date: 2022-02-18 14:15:27
 * @LastEditTime: 2022-02-20 20:56:27
 * @LastEditors: cos
 * @Description: 文章相关控制器
 * @FilePath: \campus-community-backend\src\controller\article.controller.js
 */
const { createArticle, deleteArticleByID, 
    updateArticleByID, restoreArticleByID, 
    getArticleList } = require('../service/article.service')
const { articleOperationError, articleCreateError, 
    articleDeleteError, articleParamsError, 
    articleDosNotExist, articleUpdateError, 
    articleShieldError, articleRestoreError
} = require('../constant/err.type');

class ArticleController {
    async postArticle(ctx) {
        // console.log(ctx.state);
        const { id, user_name, is_admin } = ctx.state.user
        const { title, content, summary } = ctx.request.body;
        if(!title || !content) {
            return ctx.app.emit('error', articleParamsError, ctx);
        }
        // console.log("title:", title, "title type:", typeof title);
        try {
            const res = await createArticle(id, user_name, is_admin, title, content, summary)
            if(!res) {
                console.error('发帖失败！', err);
                ctx.app.emit('error', articleCreateError, ctx)
            }
            ctx.body = {
                code: 0,
                message: "发帖成功！",
                result: {
                    article_id: res.id,
                    user_id: id,
                    user_name: res.user_name,
                    title: res.title
                }
            }
        } catch (err) {
            console.error(err);
            ctx.app.emit('error', articleOperationError, ctx)
        }
    }
    async deleteArticle(ctx) {
        // console.log("body:", ctx)
        const { article_id } = ctx.request.query
        if(!article_id) {
            return ctx.app.emit('error', articleParamsError, ctx);
        }
        try {
            const res = await deleteArticleByID(article_id, true)
            if(!res) {
                console.error("该文章不存在！");
                return ctx.app.emit('error', articleDosNotExist, ctx)
            }
            ctx.body = {
                code: 0,
                message: "删除文章成功！",
            }
        } catch (err) {
            console.error(err);
            return ctx.app.emit('error', articleDeleteError, ctx)
        }
    }
    async shieldArticle(ctx) {
        // console.log("body:", ctx)
        const { article_id } = ctx.request.query
        if(!article_id) {
            return ctx.app.emit('error', articleParamsError, ctx);
        }
        try {
            const res = await deleteArticleByID(article_id)
            if(!res) {
                console.error("该文章不存在！");
                return ctx.app.emit('error', articleDosNotExist, ctx)
            }
            ctx.body = {
                code: 0,
                message: "屏蔽该文章成功！",
            }
        } catch (err) {
            console.error(err);
            return ctx.app.emit('error', articleShieldError, ctx)
        }
    }
    async restoreArticle(ctx) {
        // console.log("body:", ctx)
        const { article_id } = ctx.request.query
        if(!article_id) {
            return ctx.app.emit('error', articleParamsError, ctx);
        }
        try {
            const res = await restoreArticleByID(article_id)
            if(!res) {
                console.error("恢复文章失败，该文章不存在或未被屏蔽");
                return ctx.app.emit('error', articleDosNotExist, ctx)
            }
            ctx.body = {
                code: 0,
                message: "恢复该文章成功！",
            }
        } catch (err) {
            console.error(err);
            return ctx.app.emit('error', articleRestoreError, ctx)
        }
    }
    async updateArticle(ctx) {
        const { id, title, content, summary } = ctx.request.body;
        // console.log(id, title, content, summary)
        if(!id) {
            return ctx.app.emit('error', articleParamsError, ctx);
        }
        const newArticle = {}
        title && Object.assign(newArticle, { title })
        content && Object.assign(newArticle, { content })
        summary && Object.assign(newArticle, { summary })
        // console.log("newArticle", newArticle)
        try {
            const res = await updateArticleByID(id, newArticle)
            if(!res) return ctx.app.emit('error', articleDosNotExist, ctx)
            ctx.body = {
                code: 0,
                message: "更新文章成功！",
            }
        } catch (err) {
            console.error('更新文章失败！', err);
            return ctx.app.emit('error', articleUpdateError, ctx)
        }
    }
    async getAllArticle(ctx) {
        try {
            const articleList = await getArticleList()
            console.log("articleList type:", typeof articleList)
            console.log(articleList)
            console.table(articleList)
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
}

module.exports = new ArticleController()