class CreateProjectCollections < ActiveRecord::Migration[5.0]
  def change
    create_table :project_collections, id: :uuid do |t|
      t.string :title, null: false
      t.integer :position
      t.string :sort_column, null: false
      t.string :sort_direction, null: false
      t.boolean :smart, default: false, null: false
      t.boolean :visible, default: false, null: false
      t.boolean :homepage, default: false, null: false
      t.string :icon
      t.integer :number_of_projects, default: 0, null: false
      t.boolean :featured_only, default: false, null: false
      t.string :slug
      t.string :description
      t.belongs_to :creator, type: :uuid, index: true
      t.timestamps
    end

    add_index :project_collections, :slug, unique: true

    create_table :collection_projects, id: :uuid do |t|
      t.belongs_to :project_collection, type: :uuid, null: false, index: true
      t.belongs_to :project, type: :uuid, null: false, index: true
      t.integer :position
      t.timestamps
    end
  end
end
