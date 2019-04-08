const ICrud = require('./interfaces/interfaceCrud')
const Sequelize = require('sequelize')

class Postgres extends ICrud {
    constructor() {
        super()
        this._driver = null
        this._herois = null
    }

    async isConnected() {
        try {
            await this._driver.autheticated;
            return true;

        } catch (error) {
            console.error('fail', error);
            return false;
        }
    }

    async defineModal() {
        this._herois = this._driver.define('tb_herois', {
            id: {
                type: Sequelize.INTEGER,
                required: true,
                primaryKey: true,
                autoIncrement: true
            },
            nome: {
                type: Sequelize.STRING,
                required: true,
            },
            poder: {
                type: Sequelize.STRING,
                required: true,
            }
        }, {
                tableName: 'tb_herois',
                freezeTableName: false,
                timestamps: false
            })
        await this._herois.sync()
    }

    async update(id, item) {
        return this._herois.update(item, { where: { id: id } })
    }

    async delete(id) {
        const query = id ? { id } : {};
        return this._herois.destroy({ where: query })
    }

    async create(item) {
        const {
            dataValues
        } = await this._herois.create(item)

        return dataValues
    }

    async read(item) {
        return this._herois.findAll({ where: item, raw: true })
    }

    async connect() {
        this._driver = new Sequelize(
            'tb_herois',
            'postgres',
            'Postgres2019!',
            {
                host: 'localhost',
                port: 15432,
                dialect: 'postgres',
                quoteIdentifiers: false,
                operatorsAliases: false
            }
        )
        this.defineModal()
    }
}

module.exports = Postgres