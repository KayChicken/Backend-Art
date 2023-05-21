import { db } from '../db.js'


class NewsController {
    async getNews(req,res) {
        try {
            const news = await db.query("SELECT * FROM newsline")
            res.json({...news.rows})
        }


        catch(err) {
            return res.status(400).json({"message" : "Произошла ошибка"})
        }
    }

}


export const newsController = new NewsController