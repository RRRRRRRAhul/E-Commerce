from analytics.views import DashboardAnalyticsView
from django.urls import path

urlpatterns = [
    path("dashboard/", DashboardAnalyticsView.as_view()),
]