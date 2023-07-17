import * as Sequelize from 'sequelize';
import { sequelize } from '../../database';

export interface UserAddModel {
    id: number
    name: string
    email: string
    password?: string | null
    salt?: string | null
    expiresAt?: Date | null
    verificationToken?: string | null
    uniqueToken?: string | null
    status: string
}

export interface UserModel extends Sequelize.Model<UserModel, UserAddModel> {
    id: number
    name: string
    email: string
    password: string
    status:string
    createdAt: string
    updatedAt: string
}

// User Model.
export const User = sequelize.define<UserModel, UserAddModel>('user', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    email: {
        type:Sequelize.STRING,
        allowNull:false,
        unique: true
    },
    password: {
        type: Sequelize.STRING
    },
    salt: {
        type: Sequelize.STRING
    },
    expiresAt: {
        type: Sequelize.DATE
    },
    verificationToken: {
        type: Sequelize.STRING
    },
    uniqueToken: {
        type: Sequelize.STRING
    },
    status:{
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'inactive'
    }
})