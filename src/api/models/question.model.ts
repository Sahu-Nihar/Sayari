import * as Sequelize from 'sequelize';
import { sequelize } from '../../database';

export interface QuestionAddModel {
    id: number
    isDeleted: boolean
    userId: number
    title: string
    body: string
}

export interface QuestionModel extends Sequelize.Model<QuestionModel, QuestionAddModel> {
    id: number
    isDeleted: boolean
    userId: number
    createdAt: string
    updatedAt: string
}

export const Question = sequelize.define<QuestionModel, QuestionAddModel>('question', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    userId: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    title: {
        type: Sequelize.STRING,
        allowNull: false,
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