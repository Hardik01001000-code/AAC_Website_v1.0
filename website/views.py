from django.shortcuts import render, get_object_or_404
from django.utils.timezone import now
from django.views.generic import TemplateView, ListView, DetailView
from .models import Blog, AboutClub, Event, GalleryImage, CategoryCover, Member, BLOG_CATEGORIES #, Project
from django.db.models import Max
import json
import calendar
from django.http import JsonResponse
from datetime import date


def _int_or(value, fallback):
    try:
        return int(value)
    except (TypeError, ValueError):
        return fallback


# Homepage
class Homepage(TemplateView):
    template_name = "homepage.html"


# Projects Section
"""
class Projects(ListView):
    model = Project
    template_name = "projects-page.html"
    context_object_name = 'projects'
"""


# Blogs Section
class BlogsList(ListView):
    model = Blog
    template_name = "blogs-page.html"
    context_object_name = 'blogs'
    paginate_by = 5

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)

        blogs = Blog.objects.all().values(
            'id', 'title', 'author', 'description', 'blog_image', 'category'
        )

        for b in blogs:
            b['category_display'] = dict(BLOG_CATEGORIES).get(b['category'], b['category'])

        context["qs_json"] = json.dumps(list(blogs))
        context["BLOG_CATEGORIES"] = BLOG_CATEGORIES  # 👈 add this
        return context


class BlogView(DetailView):
    model = Blog
    template_name = "blog.html"
    context_object_name = 'blog'


# Events Section
def events(request):
    today = date.today()

    # Parse request params
    year = _int_or(request.GET.get("year"), today.year)
    month = _int_or(request.GET.get("month"), today.month)
    selected_day = request.GET.get("day")

    # Calendar data
    first_day = date(year, month, 1)
    last_day = date(year, month, calendar.monthrange(year, month)[1])

    cal = calendar.Calendar(firstweekday=6)
    month_days = list(cal.monthdayscalendar(year, month))

    # ✅ Always have 6 rows in the calendar
    while len(month_days) < 6:
        month_days.append([0] * 7)

    # Query all events in this month
    events_qs = Event.objects.filter(date__range=(first_day, last_day))

    # Map day -> events list
    events_by_day = {}
    for e in events_qs:
        d = e.date.day
        events_by_day.setdefault(d, []).append({
            "id": e.id,
            "title": e.name,
            "date_str": e.date.strftime("%B %d, %Y"),
            "time_str": e.date.strftime("%I:%M %p"),
            "end_time_str": e.end_time.strftime("%I:%M %p") if getattr(e, 'end_time', None) else "",
            "image_url": e.image.url if e.image else ""
        })

    # Filter events if a day is selected
    selected_events = []
    if selected_day:
        try:
            sd = int(selected_day)
            selected_events = events_by_day.get(sd, [])
            events_qs = events_qs.filter(date__day=sd)  # for HTML
        except ValueError:
            selected_events = []

    # Prev/Next month
    prev_month = month - 1 if month > 1 else 12
    prev_year = year if month > 1 else year - 1
    next_month = month + 1 if month < 12 else 1
    next_year = year if month < 12 else year + 1

    # AJAX
    if request.headers.get("x-requested-with") == "XMLHttpRequest":
        return JsonResponse({
            "year": year,
            "month": month,
            "month_name": first_day.strftime("%B"),
            "month_days": month_days,
            "events_by_day": events_by_day,
            "selected_events": selected_events,
            "prev_year": prev_year,
            "prev_month": prev_month,
            "next_year": next_year,
            "next_month": next_month,
        })

    # HTML render
    context = {
        "year": year,
        "month": month,
        "month_name": first_day.strftime("%B"),
        "month_days": month_days,
        "events_by_day": events_by_day,
        "events": events_qs,
        "prev_year": prev_year,
        "prev_month": prev_month,
        "next_year": next_year,
        "next_month": next_month,
    }
    return render(request, "events-page.html", context)

#title
def event_detail(request, pk):
    event = get_object_or_404(Event, pk=pk)

    # Find the next occurrence (excluding the current one)
    next_occurrence = (
        Event.objects.filter(name=event.name, date__gt=now())
        .exclude(pk=event.pk)
        .order_by('date')
        .first()
    )

    return render(request, "event-detail.html", {
        "event": event,
        "next_occurrence": next_occurrence
    })

# Photo Gallery Section
class PhotoGalleryList(ListView):
    model = CategoryCover
    template_name = "photo-gallery.html"
    context_object_name = "galleries"

    def get_queryset(self):
        return CategoryCover.objects.all()
    
def categoryimages(request, category):
    images = GalleryImage.objects.filter(photo_type=category)
    return render(request, "gallery-images.html", {
        "images": images,
    })

# Teams Section
class TeamsList(ListView):
    model = Member
    template_name = "teams.html"
    context_object_name = "members"

    def get_queryset(self):
        return Member.objects.all()

# About Section
def about(request):
    members = Member.objects.all()
    return render(request, "about.html", {
        "members": members,
    })

def starry_nights(request):
    return render(request, "starry-nights.html")

def astrocommittee(request):
    return render(request, "astrocommittee.html")

def kss(request):
    return render(request, "kss.html")

def astrofest(request):
    return render(request, "astrofest.html")