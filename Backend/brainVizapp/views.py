# views.py

from rest_framework import viewsets, status
from rest_framework.response import Response
from .models import MRIFile
from .serializers import MRIFileSerializer
from .logic.points import process_mri_file
import os

class MRIFileViewSet(viewsets.ModelViewSet):
    serializer_class = MRIFileSerializer

    def create(self, request, *args, **kwargs):
        file_obj = request.data['file']
        ext = os.path.splitext(file_obj.name)[-1]
        print(ext)
        if ext.lower() not in ['.nii', '.nii.gz','.gz']:
            return Response({"error": "Invalid file format"}, status=status.HTTP_400_BAD_REQUEST)
        
        file_serializer = MRIFileSerializer(data=request.data)
        if file_serializer.is_valid():
            file_serializer.save()
            file_path = file_serializer.instance.file.path
            points = process_mri_file(file_path)
            return Response({"points": points}, status=status.HTTP_201_CREATED)
        
        return Response(file_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
