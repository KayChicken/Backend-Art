import { db } from '../db.js'
import { validationResult } from 'express-validator'


class NewsController {
    async getNews(req,res) {
        try {
            const page = req.params.page
            const currentPage = (page-1) * 10
            const nextPage = currentPage + 10
            const news = await db.query("SELECT news_id,news_title,news_desc,news_img,user_name,user_surname,news_date FROM newsline JOIN users ON user_id = news_author WHERE news_id > $1 AND news_id <= $2 ORDER BY news_id ASC LIMIT 10",[currentPage,nextPage])
            return res.status(200).json(news.rows)
        }


        catch(err) {
           
            return res.status(400).json({"message" : "Произошла ошибка"})
        }
    }


    async createNews (req,res) {
        try {

            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json(errors.array())
            }


            const {user_id,news_title, news_desc,news_img} = req.body
            const newNews = await db.query("INSERT INTO newsline (news_title,news_desc,news_img,news_author) VALUES ($1,$2,$3,$4)",[news_title,news_desc,news_img,user_id])
            return res.status(200).json(newNews.rows)
        }


        catch {
            return res.status(400).json({"message" : "Произошла ошибка"})
        }
    }



    async deleteNews(req,res) {


        try {
            
            const {news_id} = req.body
            await db.query("DELETE FROM newsline WHERE news_id = $1", [news_id])
            res.status(200).json({"message" : "Новость была удалена"})
        }
        


        catch {
            return res.status(400).json({"message" : "Произошла ошибка"})
        }
    

    }


    async myNews (req,res) {
        try {
            const {user_id} = req.body
            const myNews = await db.query("SELECT news_id,news_title,news_desc,news_img,user_name,user_surname,news_date FROM newsline JOIN users ON $1 = news_author ORDER BY news_id",[user_id])
            return res.status(200).json(myNews.rows)

        }

        catch {
            return res.status(400).json({"message" : "Произошла ошибка"})
        }
    }
}


export const newsController = new NewsController