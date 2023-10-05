# serializers.py

from rest_framework import serializers
from .models import MRIFile

class MRIFileSerializer(serializers.ModelSerializer):
    class Meta:
        model = MRIFile
        fields = ('file',)
