"""add_showcase_indexes

Revision ID: b3f4a5c6d7e8
Revises: 1c9da1823f34
Create Date: 2026-02-11 19:05:00.000000

"""
from typing import Sequence, Union

from alembic import op


# revision identifiers, used by Alembic.
revision: str = 'b3f4a5c6d7e8'
down_revision: Union[str, Sequence[str], None] = '1c9da1823f34'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Add composite indexes for showcase property filtering."""
    # Index for filtering published available properties by city
    op.create_index(
        'ix_properties_showcase_city',
        'properties',
        ['is_published', 'status', 'city'],
        unique=False
    )
    # Index for range filtering on price, sqm, rooms
    op.create_index(
        'ix_properties_showcase_filters',
        'properties',
        ['is_published', 'status', 'price_amount', 'sqm', 'rooms'],
        unique=False
    )


def downgrade() -> None:
    """Remove showcase indexes."""
    op.drop_index('ix_properties_showcase_filters', table_name='properties')
    op.drop_index('ix_properties_showcase_city', table_name='properties')
