import * as Sequelize from 'sequelize';
import { sequelize } from '../../database';

export interface CommentAddModel {
    id: number
    isDeleted: boolean
    userId: number
    questionId: number
    body: string
}

export interface CommentModel extends Sequelize.Model<CommentModel, CommentAddModel> {
    id: number
    isDeleted: boolean
    userId: number
    body: string
    questionId: number
    createdAt: string
    updatedAt: string
}

export const Comment = sequelize.define<CommentModel, CommentAddModel>('comment', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    userId: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    questionId: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    body: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    isDeleted: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
    }
});