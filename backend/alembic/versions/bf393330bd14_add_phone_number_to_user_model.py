"""add phone_number to user model

Revision ID: bf393330bd14
Revises: 86d85ae9c2d4
Create Date: 2026-02-15 22:44:05.392435

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'bf393330bd14'
down_revision: Union[str, Sequence[str], None] = '86d85ae9c2d4'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.add_column('users', sa.Column('phone_number', sa.String(), nullable=True))


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_column('users', 'phone_number')
