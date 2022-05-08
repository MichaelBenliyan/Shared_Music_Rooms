from html5lib import serialize
from rest_framework import serializers
from .models import Room

#serializers take data from objects and turn them into usable format for us to be able to use/check

class RoomSerializer(serializers.ModelSerializer): 
    class Meta: 
        model = Room
        fields = ('id', 'code', 'host', 'guest_can_pause', 'votes_to_skip', 'created_at')
        
        
class CreateRoomSerializer(serializers.ModelSerializer): 
    class Meta: 
        model = Room
        fields = ('guest_can_pause', 'votes_to_skip')
        
class UpdateRoomSerializer(serializers.ModelSerializer): 
    code = serializers.CharField(validators=[])
    class Meta: 
        model = Room
        fields = ('guest_can_pause', 'votes_to_skip', 'code')