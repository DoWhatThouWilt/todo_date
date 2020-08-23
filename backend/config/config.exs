# This file is responsible for configuring your application
# and its dependencies with the aid of the Mix.Config module.
#
# This configuration file is loaded before any dependency and
# is restricted to this project.

# General application configuration
use Mix.Config

config :simple_todo,
  ecto_repos: [SimpleTodo.Repo]

# Configures the endpoint
config :simple_todo, SimpleTodoWeb.Endpoint,
  url: [host: "localhost"],
  secret_key_base: "p41NV+PYws6nK8HPUr45gdD+K6/TgTiivCkYR3S+cihgDYfqfP0iVB9vG2u7eo5k",
  render_errors: [view: SimpleTodoWeb.ErrorView, accepts: ~w(json), layout: false],
  pubsub_server: SimpleTodo.PubSub,
  live_view: [signing_salt: "3+0WsR3d"]

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

# Use Jason for JSON parsing in Phoenix
config :phoenix, :json_library, Jason

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{Mix.env()}.exs"
