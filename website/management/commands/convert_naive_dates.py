# convert_naive_dates.py
from django.core.management.base import BaseCommand
from django.apps import apps
from django.utils import timezone
from django.db import transaction
from django.conf import settings

class Command(BaseCommand):
    help = "Convert naive DateTimeFields to aware (using current timezone). Use --dry-run first."

    def add_arguments(self, parser):
        parser.add_argument('--dry-run', action='store_true', help='Do not save changes, only report')
        parser.add_argument('--limit', type=int, default=0, help='Stop after N conversions (0 = no limit)')

    def handle(self, *args, **options):
        dry = options['dry_run']
        limit = options['limit']
        if not settings.USE_TZ:
            self.stdout.write(self.style.WARNING("USE_TZ is False — nothing to do."))
            return

        tz = timezone.get_current_timezone()
        total = 0

        for model in apps.get_models():
            model_label = f"{model._meta.app_label}.{model.__name__}"
            for field in model._meta.fields:
                if field.get_internal_type() == 'DateTimeField':
                    qs = model.objects.all()
                    for obj in qs:
                        val = getattr(obj, field.name)
                        if val is not None and timezone.is_naive(val):
                            if dry:
                                self.stdout.write(f"[DRY-RUN] {model_label}.{field.name} id={obj.pk} -> {val}")
                            else:
                                self.stdout.write(f"Converting {model_label}.{field.name} id={obj.pk} -> {val}")
                                with transaction.atomic():
                                    setattr(obj, field.name, timezone.make_aware(val, tz))
                                    obj.save(update_fields=[field.name])
                                total += 1
                                if limit and total >= limit:
                                    self.stdout.write(self.style.SUCCESS(f"Limit reached: {limit}. Converted total: {total}"))
                                    return

        self.stdout.write(self.style.SUCCESS(f"Converted total: {total} (dry-run={dry})"))
