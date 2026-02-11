from unittest.mock import MagicMock
import pytest
from fastapi import HTTPException, status
from app.infrastructure.api.v1.deps import get_current_active_admin, get_current_active_agent
from app.domain.enums import UserRole

def test_get_current_active_admin_success():
    mock_user = MagicMock()
    mock_user.role = UserRole.ADMIN
    result = get_current_active_admin(current_user=mock_user)
    assert result == mock_user

def test_get_current_active_admin_forbidden():
    mock_user = MagicMock()
    mock_user.role = UserRole.AGENT
    with pytest.raises(HTTPException) as excinfo:
        get_current_active_admin(current_user=mock_user)
    assert excinfo.value.status_code == status.HTTP_403_FORBIDDEN
    assert excinfo.value.detail == "The user doesn't have enough privileges"

def test_get_current_active_agent_success_as_agent():
    mock_user = MagicMock()
    mock_user.role = UserRole.AGENT
    result = get_current_active_agent(current_user=mock_user)
    assert result == mock_user

def test_get_current_active_agent_success_as_admin():
    mock_user = MagicMock()
    mock_user.role = UserRole.ADMIN
    result = get_current_active_agent(current_user=mock_user)
    assert result == mock_user

def test_get_current_active_agent_forbidden():
    mock_user = MagicMock()
    mock_user.role = "OTHER_ROLE" # Caso hipotético si existieran más roles
    with pytest.raises(HTTPException) as excinfo:
        get_current_active_agent(current_user=mock_user)
    assert excinfo.value.status_code == status.HTTP_403_FORBIDDEN
