"""Packet CRUD regression checks against the sibling backend, without a live database."""
import sys
from pathlib import Path
from types import SimpleNamespace
from unittest.mock import MagicMock
from uuid import uuid4

import pytest
from fastapi import FastAPI
from fastapi.testclient import TestClient
from sqlalchemy.exc import IntegrityError

sys.path.insert(0, str(Path(__file__).resolve().parents[2] / 'fastapi-bengkel'))
from routes import routes_packet_order as routes
from services import services_packet_order as service
from schemas.service_packet_order import CreatePacketOrder


def test_empty_list_is_success(monkeypatch):
    monkeypatch.setattr(routes, 'getAllPacketOrders', lambda db: [])
    app = FastAPI()
    app.include_router(routes.router)
    app.dependency_overrides[routes.get_db] = lambda: MagicMock()
    response = TestClient(app).get('/packetorders/all')
    assert response.status_code == 200
    assert response.json()['data'] == []


def test_update_preserves_unit_and_replaces_lines(monkeypatch):
    packet_id, product_id, unit_id = uuid4(), uuid4(), uuid4()
    old_line = SimpleNamespace(id=uuid4())
    packet = SimpleNamespace(id=packet_id, name='Old', product_line_packet_order=[old_line], service_line_packet_order=[])
    db = MagicMock()
    db.query.return_value.filter.return_value.first.return_value = packet
    monkeypatch.setattr(service, 'ProductLinePacketOrder', lambda **kw: SimpleNamespace(**kw))
    monkeypatch.setattr(service, 'to_dict', lambda obj: {'id': str(obj.id), 'name': obj.name})
    payload = CreatePacketOrder(name='Updated', product_line_packet_order=[dict(product_id=product_id, satuan_id=unit_id, quantity=2, price=100, discount=10, subtotal=190)], service_line_packet_order=[])
    result = service.updatePacketOrder(db, str(packet_id), payload)
    assert result['name'] == 'Updated'
    assert db.add.call_args.args[0].satuan_id == unit_id
    db.delete.assert_called_once_with(old_line)
    db.commit.assert_called_once()


def test_create_commits_header_and_lines_together(monkeypatch):
    db = MagicMock()
    monkeypatch.setattr(service, 'PacketOrder', lambda **kw: SimpleNamespace(**kw))
    monkeypatch.setattr(service, 'to_dict', lambda obj: {'id': str(obj.id)})
    service.CreatePacketOrdernya(db, CreatePacketOrder(name='New', product_line_packet_order=[], service_line_packet_order=[]))
    db.flush.assert_called_once()
    db.commit.assert_called_once()


def test_delete_constraint_failure_raises_and_rolls_back():
    db = MagicMock()
    db.query.return_value.filter.return_value.first.return_value = SimpleNamespace(product_line_packet_order=[], service_line_packet_order=[])
    db.commit.side_effect = IntegrityError('DELETE', {}, Exception('referenced'))
    with pytest.raises(ValueError):
        service.deletePacketOrder(db, str(uuid4()))
    db.rollback.assert_called_once()


def test_delete_failure_is_http_error(monkeypatch):
    def fail(db, packet_id):
        raise ValueError('Paket masih digunakan')
    monkeypatch.setattr(routes, 'deletePacketOrder', fail)
    app = FastAPI()
    app.include_router(routes.router)
    db = MagicMock()
    app.dependency_overrides[routes.get_db] = lambda: db
    app.dependency_overrides[routes.jwt_required] = lambda: None
    response = TestClient(app).delete('/packetorders/' + str(uuid4()))
    assert response.status_code == 400
    assert response.json()['status'] == 'error'
    db.rollback.assert_called_once()
