import { db } from '../db.js'


class NewsController {
    async getNews(req,res) {
        try {
            const page = req.params.page
            if (page === 1) {
                db.query("SELECT news_id,news_title,news_desc,news_img,user_name,user_surname,news_date FROM newsline JOIN users ON user_id = news_author ORDER BY news_id ASC LIMIT 10;")
                return res.status(200).json(news.rows)
            }
            const currentPage = (page-1) * 10
            const news = await db.query("SELECT news_id,news_title,news_desc,news_img,user_name,user_surname,news_date FROM newsline JOIN users ON user_id = news_author WHERE news_id > $1 ORDER BY news_id ASC LIMIT 10",[currentPage])
            return res.status(200).json(news.rows)
        }


        catch(err) {
           
            return res.status(400).json({"message" : "Произошла ошибка"})
        }
    }

}


export const newsController = new NewsController