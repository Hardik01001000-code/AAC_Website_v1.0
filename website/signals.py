# signals.py
from django.db.models.signals import pre_save
from django.dispatch import receiver
from django.utils import timezone
from django.conf import settings

# Import Event model - adjust import path if your Event model is in a different app/module
from website.models import Event

@receiver(pre_save, sender=Event)
def make_event_date_aware(sender, instance, **kwargs):
    if not settings.USE_TZ:
        return
    # field name 'date' assumed — change if your field is named differently
    val = getattr(instance, 'date', None)
    if val is not None and timezone.is_naive(val):
        instance.date = timezone.make_aware(val, timezone.get_current_timezone())
