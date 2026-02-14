from datetime import datetime, timezone, timedelta
from decimal import Decimal
import random
from sqlalchemy.orm import Session
from app.infrastructure.database.models import (
    Property, PropertyImage, Visit, Operation, 
    CalendarEvent, PropertyNote, OperationNote, 
    VisitNote, PropertyStatusHistory, OperationStatusHistory
)
from app.domain.enums import (
    ClientType, PropertyStatus, PropertyType, VisitStatus, 
    OperationType, OperationStatus, EventType, EventStatus
)
from .shared import get_random_time

def seed_stories(db: Session, agents: list, clients: list):
    print("🌱 Seeding Business Stories (Time-Relative & Consistent)...")
    now = datetime.now(timezone.utc)
    
    owners = [c for c in clients if c.type == ClientType.OWNER]
    prospects = [c for c in clients if c.type != ClientType.OWNER]
    
    # Expanded Photos Dictionary for Richer Galleries
    photos = {
        "living": ["1586023492125-27b2c045efd7", "1615529328329-82990aed575c", "1484154218962-a197022b5858", "1600607687949-5accf517f171", "1554995207-c18c203602cb", "1556020685-ae41abfc9365"],
        "kitchen": ["1600585154340-be6161a56a0c", "1556911228-e59f20c93023", "1491333078410-32115f82b79b", "1565538810-cedb1016ce82", "1588854337486-443069bb9e3d"],
        "bedroom": ["1505691938895-1758d7eaa511", "1540518614846-7ecd8236029a", "1566665797739-1674de7a421a", "1595526114035-0d45ed16cfbf", "1560185127-6ed189bf02f4"],
        "bathroom": ["1552321554-5fefe8c9ef14", "1620626012055-d164e285bc77", "1584622650111-993a426fbf0a"],
        "exterior": ["1564013799919-ab600027ffc6", "1512917774080-9991f1c4c750", "1480074568708-e7b720bb3f09", "1600585154340-be6161a56a0c", "1625603736597-233bb963666d"],
        "detail": ["1493663284049-e3e5978a486d", "1481277542478-63cb590ba442", "1513694203232-719a280e022f"],
        "garage": ["1555462058-204128f7344d", "1506521781263-d8422e82f27a"],
        "office": ["1497366216548-37526070297c", "1524758631624-e2820e1b4c6c", "1486406146926-c627a92ad1ab"],
        "commercial": ["1497366811353-6870744d04b2", "1556761175-5973ac0f96fc"]
    }

    properties_data = [
        {
            "title": "Piso Luminoso en el Centro", "city": "Madrid", "price": 250000, "rooms": 3, "sqm": 90, "type": OperationType.SALE, 
            "images": [photos["living"][0], photos["kitchen"][0], photos["bedroom"][0], photos["bathroom"][0], photos["detail"][0], photos["living"][4]],
            "notes": ["Reformado recientemente", "Comunidad: 50€/mes"]
        },
        {
            "title": "Chalet con Jardín", "city": "Las Rozas", "price": 450000, "rooms": 5, "sqm": 250, "type": OperationType.SALE, 
            "images": [photos["exterior"][0], photos["living"][1], photos["kitchen"][1], photos["bedroom"][1], photos["bathroom"][1], photos["exterior"][4], photos["detail"][1]],
            "notes": ["Piscina climatizada", "Garaje para 2 coches"]
        },
        {
            "title": "Estudio Moderno", "city": "Madrid", "price": 120000, "rooms": 1, "sqm": 35, "type": OperationType.SALE, 
            "images": [photos["living"][2], photos["bedroom"][2], photos["kitchen"][2], photos["bathroom"][2], photos["detail"][2]],
            "notes": ["Ideal inversores", "Alta rentabilidad alquiler"]
        },
        {
            "title": "Ático con Vistas", "city": "Madrid", "price": 320000, "rooms": 3, "sqm": 110, "type": OperationType.SALE, 
            "images": [photos["detail"][2], photos["living"][3], photos["kitchen"][3], photos["bedroom"][3], photos["exterior"][1], photos["detail"][0]],
            "notes": ["Terraza 40m2", "Orientación Sur"]
        },
        {
            "title": "Local Comercial", "city": "Alcorcón", "price": 1500, "rooms": 1, "sqm": 80, "type": OperationType.RENT, 
            "images": [photos["commercial"][0], photos["office"][0], photos["exterior"][2], photos["bathroom"][0], photos["detail"][1]],
            "notes": ["Salida de humos", "Licencia bar vigente"]
        },
        {
            "title": "Apartamento en la Playa", "city": "Valencia", "price": 180000, "rooms": 2, "sqm": 65, "type": OperationType.SALE, 
            "images": [photos["exterior"][3], photos["living"][0], photos["kitchen"][4], photos["bedroom"][4], photos["detail"][2], photos["living"][5]],
            "notes": ["Primera línea de playa", "Vistas al mar"]
        },
        {
            "title": "Casa de Campo", "city": "Chinchón", "price": 210000, "rooms": 4, "sqm": 150, "type": OperationType.SALE, 
            "images": [photos["exterior"][2], photos["living"][1], photos["kitchen"][2], photos["bedroom"][0], photos["bathroom"][1], photos["detail"][1]],
            "notes": ["Parcela 1000m2", "Pozo propio"]
        },
        {
            "title": "Oficina Céntrica", "city": "Madrid", "price": 1200, "rooms": 4, "sqm": 120, "type": OperationType.RENT, 
            "images": [photos["office"][1], photos["living"][2], photos["commercial"][1], photos["detail"][0], photos["exterior"][0]],
            "notes": ["Fibra óptica instalada", "Portero físico"]
        },
        {
            "title": "Duplex Exclusivo", "city": "Madrid", "price": 550000, "rooms": 4, "sqm": 180, "type": OperationType.SALE, 
            "images": [photos["exterior"][3], photos["living"][3], photos["kitchen"][1], photos["bedroom"][2], photos["bathroom"][2], photos["detail"][2]],
            "notes": ["Domótica integral", "Suelo radiante"]
        },
        {
            "title": "Garaje Amplio", "city": "Madrid", "price": 15000, "rooms": 0, "sqm": 15, "type": OperationType.SALE, 
            "images": [photos["garage"][0], photos["garage"][1], photos["exterior"][1]],
            "notes": ["Fácil maniobra", "Vigilancia 24h"]
        }
    ]

    for i, p_info in enumerate(properties_data):
        agent = agents[i % len(agents)]
        owner = owners[i % len(owners)]
        
        status = PropertyStatus.AVAILABLE
        scenario = "AVAILABLE"
        
        # 1. Create Property
        is_featured = i in [1, 2, 3, 6, 8, 9]  # Mark exactly 6 as featured
        
        # New Field Logic
        p_type = random.choice([PropertyType.APARTMENT, PropertyType.HOUSE, PropertyType.CHALET])
        op_type = OperationType.RENT if p_info["price"] < 3000 else OperationType.SALE
        
        prop = Property(
            title=p_info["title"], city=p_info["city"], status=status, 
            price_amount=Decimal(p_info["price"]), sqm=p_info["sqm"], rooms=p_info["rooms"],
            baths=random.randint(1, 4), floor=random.randint(0, 8) if p_type == PropertyType.APARTMENT else None,
            property_type=p_type, operation_type=op_type,
            has_elevator=random.choice([True, False]) if p_type == PropertyType.APARTMENT else False,
            captor_agent_id=agent.id, owner_client_id=owner.id,
            public_description=f"Magnífica oportunidad en {p_info['city']}. {p_info['title']} con excelentes calidades. Ideal para entrar a vivir o invertir.",
            address_line1=f"Calle del Progreso {i*10 + 1}", postal_code="28001",
            is_featured=is_featured
        )
        db.add(prop)
        db.flush()
        
        # Add Properties Notes
        for note_txt in p_info.get("notes", []):
            db.add(PropertyNote(property_id=prop.id, author_user_id=agent.id, text=note_txt))

        # Images
        for pos, img_id in enumerate(p_info["images"]):
            db.add(PropertyImage(property_id=prop.id, storage_key=f"u_{img_id}", 
                public_url=f"https://images.unsplash.com/photo-{img_id}?auto=format&fit=crop&w=1200&q=80",
                position=pos, is_cover=(pos == 0)))

        # 2. History & Future Events based on Scenario
        if scenario != "AVAILABLE":
            prospect = prospects[i % len(prospects)]
            
            # --- PAST DATA (Max 7 days back) ---
            # 2.1 Past Visits
            num_past = 2 if scenario in ["CLOSED_SALE", "NEGOTIATION", "RESERVED"] else 1
            for v_idx in range(num_past):
                # Between now-6 and now-1
                v_date = get_random_time(now - timedelta(days=random.randint(1, 6)))
                visit = Visit(client_id=prospect.id, property_id=prop.id, agent_id=agent.id, scheduled_at=v_date, status=VisitStatus.DONE)
                db.add(visit)
                db.flush()
                db.add(VisitNote(visit_id=visit.id, author_user_id=agent.id, text=f"Visita satisfactoria #{v_idx+1}. Interés alto.", created_at=v_date))
                db.add(CalendarEvent(agent_id=agent.id, starts_at=v_date, ends_at=v_date + timedelta(hours=1),
                    type=EventType.VISIT, status=EventStatus.ACTIVE, title=f"Visita: {prop.title}", 
                    visit_id=visit.id, client_id=prospect.id, property_id=prop.id))

            # 2.2 Past Operations & History
            op_status = OperationStatus.INTEREST
            if scenario in ["CLOSED_SALE", "CLOSED_RENTAL"]: op_status = OperationStatus.CLOSED
            elif scenario == "NEGOTIATION": op_status = OperationStatus.NEGOTIATION
            elif scenario == "RESERVED": op_status = OperationStatus.RESERVED
            
            op = Operation(type=p_info["type"], status=op_status, client_id=prospect.id, property_id=prop.id, agent_id=agent.id)
            db.add(op)
            db.flush()
            
            # Change status history (Past 4 days)
            db.add(OperationStatusHistory(operation_id=op.id, from_status=OperationStatus.INTEREST, to_status=op_status,
                changed_at=now - timedelta(days=random.randint(2, 4)), changed_by_user_id=agent.id, note="Evolución coherente."))
            
            # Property History
            db.add(PropertyStatusHistory(property_id=prop.id, from_status=PropertyStatus.AVAILABLE, to_status=status,
                changed_at=now - timedelta(days=1), changed_by_user_id=agent.id, to_price=Decimal(p_info["price"])))

            if scenario == "NEGOTIATION":
                op_note_date = now - timedelta(days=2)
                db.add(OperationNote(operation_id=op.id, author_user_id=agent.id, text="Cliente ha presentado oferta vinculante.", created_at=op_note_date))

            # --- FUTURE DATA (Max 30 days ahead) ---
            if scenario == "NEGOTIATION":
                # Future visit or reminder
                f_date = get_random_time(now + timedelta(days=random.randint(1, 4)))
                db.add(CalendarEvent(agent_id=agent.id, starts_at=f_date, ends_at=f_date + timedelta(hours=1),
                    type=EventType.REMINDER, status=EventStatus.ACTIVE, title=f"Llamar a {prospect.full_name} (Oferta)"))
            
            if scenario == "RESERVED":
                # Notary appointment in 10 days
                f_date = get_random_time(now + timedelta(days=10))
                db.add(CalendarEvent(agent_id=agent.id, starts_at=f_date, ends_at=f_date + timedelta(hours=2),
                    type=EventType.VISIT, status=EventStatus.ACTIVE, title=f"Cita Notaría: {prop.title}"))

            if scenario == "INTEREST":
                # Future visit
                f_date = get_random_time(now + timedelta(days=random.randint(2, 7)))
                db.add(CalendarEvent(agent_id=agent.id, starts_at=f_date, ends_at=f_date + timedelta(hours=1),
                    type=EventType.VISIT, status=EventStatus.ACTIVE, title=f"2ª Visita: {prop.title}", property_id=prop.id, client_id=prospect.id))

    db.commit()
