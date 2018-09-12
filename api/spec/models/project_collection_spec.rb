require 'rails_helper'

RSpec.describe ProjectCollection, type: :model do

  it "has a valid factory" do
    expect(FactoryBot.build(:project_collection)).to be_valid
  end

  it "correctly sets the sort_column and sort_direction" do
    pc = FactoryBot.create(:project_collection, sort_order: "column: :dir")
    expect(pc.sort_column).to eq "column"
    expect(pc.sort_direction).to eq "dir"
  end

  it "has a method that returns valid ordering params" do
    pc = FactoryBot.create(:project_collection, sort_column: "column", sort_direction: "dir")
    expect(pc.sort_order).to eq({ "column" => "dir" })
  end

end
