import { db } from '../db.js'


class NewsController {
    async getNews(req,res) {
        try {
            const page = req.params.page
            if (page === 1) {
                db.query("SELECT * FROM newsline ORDER BY id ASC LIMIT 10;")
                return res.status(200).json(news.rows)
            }
            const currentPage = (page-1) * 10
            const news = await db.query("SELECT * FROM newsline WHERE news_id > $1 ORDER BY news_id ASC LIMIT 10",[currentPage])
            return res.status(200).json(news.rows)
        }


        catch(err) {
           
            return res.status(400).json({"message" : "Произошла ошибка"})
        }
    }

}


export const newsController = new NewsController