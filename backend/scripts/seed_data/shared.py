from datetime import datetime
import random

def get_random_time(base_date: datetime, start_hour=9, end_hour=19):
    """Returns a random time within working hours for a given date."""
    h = random.randint(start_hour, end_hour)
    m = random.choice([0, 15, 30, 45])
    return base_date.replace(hour=h, minute=m, second=0, microsecond=0)
