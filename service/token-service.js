import jwt from 'jsonwebtoken'
import { db } from '../db.js'


class TokenService {
    generateToken(payload) {
        const accessToken = jwt.sign(payload,process.env.JWT_ACCESS_SECRET, {expiresIn:'30m'})
        const refreshToken = jwt.sign(payload,process.env.JWT_REFRESH_SECRET, {expiresIn:'30d'})
        return {
            accessToken,
            refreshToken
        }
    }


    async saveToken (userId , refreshToken) {
        const tokenData = await db.query("SELECT * FROM user_refresh_token WHERE fk_user_id = $1",[userId])
        if (tokenData.rowCount > 0) {
            const changeToken = await db.query("UPDATE user_refresh_token SET refreshToken = $1" , [refreshToken])
            return changeToken.rows
        }
        const token = await db.query("INSERT INTO user_refresh_token VALUES ($1,$2)", [userId,refreshToken])
        return token
    }
}




export const tokenService = new TokenService