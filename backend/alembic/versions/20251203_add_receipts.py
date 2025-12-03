"""add message receipts and indexes

Revision ID: 20251203_add_receipts
Revises: 20251203_add_attachments
Create Date: 2025-12-03
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = "20251203_add_receipts"
down_revision: Union[str, None] = "20251203_add_attachments"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "message_receipts",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("message_id", sa.Integer(), nullable=False),
        sa.Column("user_id", sa.Integer(), nullable=False),
        sa.Column("delivered_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("read_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.ForeignKeyConstraint(["message_id"], ["messages.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("message_id", "user_id", name="uq_message_receipt"),
    )
    op.create_index("ix_message_receipts_message_id", "message_receipts", ["message_id"], unique=False)
    op.create_index("ix_message_receipts_user_id", "message_receipts", ["user_id"], unique=False)
    op.create_index("ix_attachments_object_key", "attachments", ["object_key"], unique=False)


def downgrade() -> None:
    op.drop_index("ix_attachments_object_key", table_name="attachments")
    op.drop_index("ix_message_receipts_user_id", table_name="message_receipts")
    op.drop_index("ix_message_receipts_message_id", table_name="message_receipts")
    op.drop_table("message_receipts")
