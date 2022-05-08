from django.urls import path
from .views import index

app_name = 'frontend'

urlpatterns = [
    #have to name a path in order to use redirect (spotify>views.py)
    path('', index, name=''),
    path('join', index),
    path('create', index),
    path('join/1', index),
    path('room/<str:roomCode>', index)
]
