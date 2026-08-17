const { DataTypes } = require('sequelize')

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.addColumn('blogs', 'created_at', {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: queryInterface.sequelize.literal('CURRENT_TIMESTAMP')
    })
    await queryInterface.addColumn('blogs', 'updated_at', {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: queryInterface.sequelize.literal('CURRENT_TIMESTAMP')
    })
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.removeColumn('blogs', 'created_at')
    await queryInterface.removeColumn('blogs', 'updated_at')
  }
}