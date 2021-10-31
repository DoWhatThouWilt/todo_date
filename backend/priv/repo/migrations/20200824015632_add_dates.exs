defmodule SimpleTodo.Repo.Migrations.AddDates do
  use Ecto.Migration

  def change do
    alter table(:todos) do
      add :due, :date
    end
  end
end
