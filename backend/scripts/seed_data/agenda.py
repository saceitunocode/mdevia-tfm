from datetime import datetime, timezone, timedelta
from app.infrastructure.database.models import CalendarEvent
from app.domain.enums import EventType, EventStatus
from .shared import get_random_time
import random

def seed_dense_agenda(db, agents, clients, properties):
    print("🌱 Seeding Dense Agenda (+1 Month Future)...")
    now = datetime.now(timezone.utc)
    
    # Generate ~50 random events across the next 30 days to make the calendar look alive
    event_titles = {
        EventType.REMINDER: ["Seguimiento clientes", "Actualizar precios", "Revisar contratos", "Llamar banco", "Preparar documentación"],
        EventType.CAPTATION: ["Visita captación portal 4", "Reunión comunidad vecinos", "Valoración piso Pozuelo", "Captación casa centro"],
        EventType.NOTE: ["Bloquear tarde para curso", "Reunión equipo FR", "Almuerzo con socio", "Revisión portal inmobiliario"],
        EventType.VISIT: ["Visita rutinaria", "Entrega de llaves", "Firma reserva", "Enseñar local"]
    }

    for day_off in range(1, 31):
        # Probability of events in a day
        if random.random() > 0.3: # 70% chance of having data for a day
            target_day = now + timedelta(days=day_off)
            
            # Each agent can have 1-2 events
            for agent in agents:
                if random.random() > 0.4:
                    e_type = random.choice(list(event_titles.keys()))
                    title = random.choice(event_titles[e_type])
                    start = get_random_time(target_day)
                    
                    # Occasionally link to a random client/property
                    cl = random.choice(clients) if random.random() > 0.7 else None
                    pr = random.choice(properties) if random.random() > 0.7 else None
                    
                    db.add(CalendarEvent(
                        agent_id=agent.id, starts_at=start, ends_at=start + timedelta(hours=1),
                        type=e_type, status=EventStatus.ACTIVE, title=title,
                        client_id=cl.id if cl else None, property_id=pr.id if pr else None
                    ))

    db.commit()
