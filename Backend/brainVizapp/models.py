
from django.db import models

class MRIFile(models.Model):
    file = models.FileField(upload_to='uploads/')
