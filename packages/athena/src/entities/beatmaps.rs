//! `SeaORM` Entity, @generated by sea-orm-codegen 1.1.0

use sea_orm::entity::prelude::*;

#[derive(Copy, Clone, Default, Debug, DeriveEntity)]
pub struct Entity;

impl EntityName for Entity {
    fn table_name(&self) -> &str {
        "beatmaps"
    }
}

#[derive(Clone, Debug, PartialEq, DeriveModel, DeriveActiveModel, Eq)]
pub struct Model {
    pub id: i32,
    pub beatmapset_id: i32,
    pub bpm: Decimal,
    pub creator_id: i32,
    pub deleted_at: Option<DateTime>,
    pub game_mode: i16,
    pub key_count: Option<i16>,
    pub play_count: i32,
    pub ranked_status: i16,
    pub star_rating: Decimal,
    pub total_length: i32,
    pub version: String,
}

#[derive(Copy, Clone, Debug, EnumIter, DeriveColumn)]
pub enum Column {
    Id,
    BeatmapsetId,
    Bpm,
    CreatorId,
    DeletedAt,
    GameMode,
    KeyCount,
    PlayCount,
    RankedStatus,
    StarRating,
    TotalLength,
    Version,
}

#[derive(Copy, Clone, Debug, EnumIter, DerivePrimaryKey)]
pub enum PrimaryKey {
    Id,
}

impl PrimaryKeyTrait for PrimaryKey {
    type ValueType = i32;
    fn auto_increment() -> bool {
        true
    }
}

#[derive(Copy, Clone, Debug, EnumIter)]
pub enum Relation {
    Beatmapsets,
    Users,
}

impl ColumnTrait for Column {
    type EntityName = Entity;
    fn def(&self) -> ColumnDef {
        match self {
            Self::Id => ColumnType::Integer.def(),
            Self::BeatmapsetId => ColumnType::Integer.def(),
            Self::Bpm => ColumnType::Decimal(None).def(),
            Self::CreatorId => ColumnType::Integer.def(),
            Self::DeletedAt => ColumnType::DateTime.def().null(),
            Self::GameMode => ColumnType::SmallInteger.def(),
            Self::KeyCount => ColumnType::SmallInteger.def().null(),
            Self::PlayCount => ColumnType::Integer.def(),
            Self::RankedStatus => ColumnType::SmallInteger.def(),
            Self::StarRating => ColumnType::Decimal(None).def(),
            Self::TotalLength => ColumnType::Integer.def(),
            Self::Version => ColumnType::String(StringLen::None).def(),
        }
    }
}

impl RelationTrait for Relation {
    fn def(&self) -> RelationDef {
        match self {
            Self::Beatmapsets => Entity::belongs_to(super::beatmapsets::Entity)
                .from(Column::BeatmapsetId)
                .to(super::beatmapsets::Column::Id)
                .into(),
            Self::Users => Entity::belongs_to(super::users::Entity)
                .from(Column::CreatorId)
                .to(super::users::Column::Id)
                .into(),
        }
    }
}

impl Related<super::beatmapsets::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::Beatmapsets.def()
    }
}

impl Related<super::users::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::Users.def()
    }
}

impl ActiveModelBehavior for ActiveModel {}
