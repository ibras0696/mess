from fastapi import status


def register_user(client, email: str, username: str):
    resp = client.post(
        "/api/auth/register",
        json={"email": email, "password": "Password123", "username": username},
    )
    assert resp.status_code == status.HTTP_201_CREATED
    data = resp.json()
    return data["user"]["id"], data["access_token"]


def auth_header(token: str) -> dict[str, str]:
    return {"Authorization": f"Bearer {token}"}


def test_create_chat_and_message_flow(client):
    user1_id, token1 = register_user(client, "u1@example.com", "u1")
    user2_id, token2 = register_user(client, "u2@example.com", "u2")

    # create chat
    resp_chat = client.post(
        "/api/chats",
        headers=auth_header(token1),
        json={"type": "dialog", "title": None, "members": [user2_id]},
    )
    assert resp_chat.status_code == status.HTTP_201_CREATED
    chat_id = resp_chat.json()["id"]

    # send message with XSS text and attachment meta
    resp_msg = client.post(
        f"/api/chats/{chat_id}/messages",
        headers=auth_header(token1),
        json={
            "text": "<b>hello</b>",
            "attachments": [
                {
                    "object_key": "uploads/1/file.png",
                    "file_name": "file.png",
                    "content_type": "image/png",
                    "size_bytes": 10,
                    "url": "http://example.com",
                }
            ],
        },
    )
    assert resp_msg.status_code == status.HTTP_201_CREATED
    msg = resp_msg.json()
    # text should be escaped, not raw HTML
    assert msg["text"] == "&lt;b&gt;hello&lt;/b&gt;"
    assert msg["attachments"] and msg["attachments"][0]["file_name"] == "file.png"

    # list messages as second user
    resp_list = client.get(
        f"/api/chats/{chat_id}/messages",
        headers=auth_header(token2),
    )
    assert resp_list.status_code == status.HTTP_200_OK
    messages = resp_list.json()
    assert len(messages) == 1
    assert messages[0]["text"] == "&lt;b&gt;hello&lt;/b&gt;"

    # non-member cannot access
    user3_id, token3 = register_user(client, "u3@example.com", "u3")
    resp_forbidden = client.get(
        f"/api/chats/{chat_id}/messages",
        headers=auth_header(token3),
    )
    assert resp_forbidden.status_code == status.HTTP_403_FORBIDDEN
