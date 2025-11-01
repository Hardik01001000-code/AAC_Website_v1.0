from django.db import models
from django_ckeditor_5.fields import CKEditor5Field

# Projects
# Currently No need to implement, will see in future
class Project(models.Model):
    title = models.CharField(max_length=32, default="")
    description = models.TextField(default="")
    references = models.CharField(max_length=32, default="")
    research_paper = models.FileField(blank=True, null=True, upload_to="papers/")
    status = models.BooleanField(default=True)
    cover_page = models.ImageField(blank=True, null=True, upload_to="gallery/project_covers/")

    def __str__(self):
        return f"Title: {self.title} | Description: {self.description[:30]}"
    

# Contains Images Only
class ProjectImage(models.Model):
    project_id = models.ForeignKey(Project, on_delete=models.CASCADE, related_name="project_images", null=True)
    image = models.ImageField(blank=True, null=True, upload_to="gallery/project_images/")

    def __str__(self):
        return f"Title: {self.project_id}"
 

# Contains About Contributors of the Projects
class Contributor(models.Model):
    project_id = models.ForeignKey(Project, on_delete=models.CASCADE, related_name="contributors", null=True)
    name = models.CharField(max_length=64, null=True, blank=True)

    def __str__(self):
        return f"Title: {self.project_id} | name: {self.name[:30]}"
    

# All the photo Gallery Images
CATEGORIES = [
        ('night_sky_stars', 'Night Sky Stars'),
        ('nebula', 'Nebula'),
        ('stargazing', 'Stargazing'),
        ('planet_photography', 'Planet Photography'),
        ('moon_photography', 'Moon Photography'),
        ('star_clusters', 'Star Clusters'),
        ('galaxy_photography', 'Galaxy Photography'),
        ('eclipse_photography', 'Eclipse Photography'),
    ]
class GalleryImage(models.Model):
    image = models.ImageField(blank=False, null=False, upload_to="gallery/others_photos/")
    title = models.CharField(max_length=32)
    description = models.TextField(max_length=128)
    photographer_name = models.CharField(max_length=64)
    photo_type = models.CharField(max_length=32, choices=CATEGORIES)
    date_uploaded = models.DateTimeField(blank=True, null=True)
    approved = models.BooleanField(default=True)

    def __str__(self):
        return f"Title: {self.title} | Photo Credits: {self.photographer_name} | Type: {self.photo_type}"
    
class CategoryCover(models.Model):
    category = models.CharField(max_length=32, choices=CATEGORIES, unique=True)
    cover_image = models.ImageField(upload_to='gallery/category_covers/')
    

# Events
class Event(models.Model):
    name = models.CharField(max_length=32)
    description = models.TextField(max_length=1024, blank=True, null=True)
    date = models.DateTimeField(blank=True, null=True)
    image = models.ImageField(blank=True, null=True, upload_to="gallery/events/")
    status = models.CharField(max_length=8)
    location = models.TextField(max_length=128)
    event_type = models.CharField(max_length=32)
    registration_link = models.URLField(blank=True, null=True)

    def __str__(self):
        return f"Name: {self.name} | Date: {self.date} | Type: {self.event_type}"
    

# About Section
class AboutClub(models.Model):
    about = models.TextField(max_length=16384)
    def __str__(self):
        return self.about[:30]
    

# About Recruitments
class Recruitment(models.Model):
    recruitment_status = models.BooleanField(default=False)
    recruitment_description = models.TextField(max_length=256)
    closing_date = models.DateTimeField(null=True)
    form_link = models.URLField(blank=True)

    def __str__(self):
        return f"recruitment date: {self.closing_date}"
    

# Blogs Section
BLOG_CATEGORIES = [
        ('astronomy', 'Astronomy'),
        ('physics', 'Physics'),
        ('space_missions', 'Space Missions'),
        ('people', 'People'),
        ('astropoetry', 'Astropoetry'),
        ('astrofiction', 'Astrofiction'),
        ('book_reviews', 'Book Reviews'),
        ('mythology', 'Mythology'),
        ('philosophy', 'Philosophy'),
    ]
class Blog(models.Model):
    title = models.CharField(max_length=128, default="")
    author = models.CharField(max_length=128)
    description = models.CharField(max_length=1024)
    content = CKEditor5Field(max_length=16384)

    blog_image = models.ImageField(blank=False, null=False, upload_to="gallery/blogs/", default="")
    category = models.CharField(max_length=32, choices=BLOG_CATEGORIES, null=True, blank=True, default='astronomy')

    def __str__(self):
        return f"Author: {self.author} | Description: {self.description[:30]}"
    
# Teams
class Member(models.Model):
    name = models.CharField(max_length=64)
    role = models.CharField(max_length=64)
    image = models.ImageField(blank=True, null=True, upload_to="gallery/team/")

    def __str__(self):
        return f"Name: {self.name} | Role: {self.role}"