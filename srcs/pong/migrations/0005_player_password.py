# Generated by Django 5.0.3 on 2024-03-09 15:03

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('pong', '0004_message'),
    ]

    operations = [
        migrations.AddField(
            model_name='player',
            name='password',
            field=models.CharField(default='', max_length=100),
        ),
    ]
