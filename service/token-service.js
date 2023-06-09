import jwt from 'jsonwebtoken'
import { db } from '../db.js'
import dotenv from 'dotenv'
dotenv.config()

class TokenService {
    generateToken(payload) {
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: '30d' })
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: '30d' })
        return {
            accessToken,
            refreshToken
        }
    }


    async saveToken(userId, refreshToken) {
        
        const tokenData = await db.query("SELECT * FROM user_refresh_token WHERE fk_user_id = $1", [userId])
        if (tokenData.rowCount > 0) {
            const changeToken = await db.query("UPDATE user_refresh_token SET refreshToken = $1", [refreshToken])
            return changeToken.rows
        }
        const token = await db.query("INSERT INTO user_refresh_token VALUES ($1,$2)", [userId, refreshToken])
        return token
    }


    async removeToken(refreshToken) {
        const tokenData = await db.query("DELETE FROM user_refresh_token WHERE refreshtoken = $1", [refreshToken])
    }


    async validateAccessToken(token) {
        try {
            const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET)
            return userData
        }

        catch (e) {
            return null
        }
    }


    async validateRefreshToken(token) {
        try {
            const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET)
            return userData
        }

        catch (e) {
            return null
        }
    }


    async findToken(refreshToken) {
        try {
            const tokenData = await db.query("SELECT * FROM user_refresh_token WHERE refreshtoken = $1",[refreshToken])
            return tokenData.rows
        }

        catch (e) {
            return null
        }
    }

}




export const tokenService = new TokenService