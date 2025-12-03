from fastapi import status


def test_register_and_login(client):
    resp = client.post(
        "/api/auth/register",
        json={"email": "a@example.com", "password": "Password123", "username": "alice"},
    )
    assert resp.status_code == status.HTTP_201_CREATED
    data = resp.json()
    assert data["user"]["email"] == "a@example.com"
    assert data["access_token"]
    assert data["refresh_token"]

    # Duplicate email should fail
    resp_dup = client.post(
        "/api/auth/register",
        json={"email": "a@example.com", "password": "Password123", "username": "alice2"},
    )
    assert resp_dup.status_code == status.HTTP_400_BAD_REQUEST

    # Login works
    resp_login = client.post(
        "/api/auth/login",
        json={"email": "a@example.com", "password": "Password123"},
    )
    assert resp_login.status_code == status.HTTP_200_OK
    login_data = resp_login.json()
    assert login_data["user"]["email"] == "a@example.com"

    # Wrong password
    resp_wrong = client.post(
        "/api/auth/login",
        json={"email": "a@example.com", "password": "wrongpass"},
    )
    assert resp_wrong.status_code == status.HTTP_401_UNAUTHORIZED
