import * as Sequelize from 'sequelize';
import { sequelize } from '../../database';

export interface AnswerAddModel {
    id: number
    userId: number
    body: string
    questionId: number
    isAccepted: boolean
    isDeleted: boolean
}

export interface AnswerModel extends Sequelize.Model<AnswerModel, AnswerAddModel> {
    id: number
    userId: number
    questionId: number
    body:string
    isAccepted: boolean
    isDeleted: boolean
    createdAt: string
    updatedAt: string
}

export const Answer = sequelize.define<AnswerModel, AnswerAddModel>('answer', {
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
    isAccepted: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
    },
    isDeleted: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
    }
});