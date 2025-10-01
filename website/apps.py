from django.apps import AppConfig

class WebsiteConfig(AppConfig):
    name = 'website'

    def ready(self):
        # import signals to register them
        import website.signals  # noqa: F401
