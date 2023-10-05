# urls.py

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'get-points', views.MRIFileViewSet,basename='get-points')

urlpatterns = [
    path('', include(router.urls)),
]
