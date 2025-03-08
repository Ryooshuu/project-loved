use std::env;
use actix_web::{middleware::Logger, web, App, HttpServer};
use dotenvy::dotenv;
use errors::LovedError;
use state::LovedState;

pub mod routes;
pub mod service;
pub mod state;
pub mod errors;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    dotenv().expect("A proper environmental file has not been found");

    // Initialize the state here as the new function is async
    let state = LovedState::new().await;
    let workers = if env::var("APP_ENVIRONMENT").unwrap_or("development".to_string()) == "production".to_string() {
        8
    } else {
        4
    };

    HttpServer::new(move || {
        App::new()
        .wrap(Logger::new("%a %{User-Agent}i"))
            .app_data(web::JsonConfig::default()
                .error_handler(|err, _| LovedError::from(err).into())
            )
            .app_data(web::Data::new(state.clone()))

            // /oauth
            .service(
                web::scope("/oauth")
                    .service(routes::oauth::start_token)
                    .service(routes::oauth::login_token_callback)
            )

            // /*
            .default_service(web::route().to(routes::handle_default))
    })
    .workers(workers)    .bind((
        "127.0.0.1",
        env::var("SERVER_PORT")
            .expect("A port must be provided to run this application")
            .parse::<u16>()
            .unwrap(),
    ))?
    .run()
    .await
}
