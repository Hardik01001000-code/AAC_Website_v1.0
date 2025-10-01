from django.urls import path

from . import views

urlpatterns = [
    path("", views.Homepage.as_view(), name="homepage"),
    # Projects is not implemented yet
    #path("projects", views.Projects.as_view(), name="projects"),
    path("blogs", views.BlogsList.as_view(), name="blogs"),
    path("events", views.events, name="events"),
    path("gallery", views.PhotoGalleryList.as_view(), name="photo-gallery"),
    path("about", views.about, name="about"),
    path("team", views.TeamsList.as_view(), name="teams"),
    path("events/starrynights", views.starry_nights, name="starry-nights"),
    path("events/astrocommittee", views.astrocommittee, name="astrocommittee"),
    path("events/kss", views.kss, name="kss"), 
    path("events/astrofest", views.astrofest, name="astrofest"),
    path("blog/<int:pk>", views.BlogView.as_view(), name="blog"),
    path("gallery/<str:category>", views.categoryimages, name="image"),
    path("events/<int:pk>/", views.event_detail, name="event-detail"),
]
