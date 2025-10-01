from django.contrib import admin

from .models import Project, ProjectImage, Contributor, GalleryImage, Event, AboutClub, Recruitment, Blog, CategoryCover, Member

# Register your models here.
admin.site.register(Project)
admin.site.register(ProjectImage)
admin.site.register(Contributor)
admin.site.register(GalleryImage)
admin.site.register(Event)
admin.site.register(AboutClub)
admin.site.register(Recruitment)
admin.site.register(Blog)
admin.site.register(CategoryCover)
admin.site.register(Member)
