package com.wildfire.dto;

public class SSIWeightsDto {

    private double academicsWeight = 0.25;
    private double attendanceWeight = 0.25;
    private double placementWeight = 0.25;
    private double skillsWeight = 0.25;

    public SSIWeightsDto() {}

    public SSIWeightsDto(double academicsWeight, double attendanceWeight, double placementWeight, double skillsWeight) {
        this.academicsWeight = academicsWeight;
        this.attendanceWeight = attendanceWeight;
        this.placementWeight = placementWeight;
        this.skillsWeight = skillsWeight;
    }

    public boolean isValid() {
        if (academicsWeight < 0 || attendanceWeight < 0 || placementWeight < 0 || skillsWeight < 0) {
            return false;
        }
        double sum = academicsWeight + attendanceWeight + placementWeight + skillsWeight;
        return Math.abs(sum - 1.0) < 0.001;
    }

    public double getAcademicsWeight() {
        return academicsWeight;
    }

    public void setAcademicsWeight(double academicsWeight) {
        this.academicsWeight = academicsWeight;
    }

    public double getAttendanceWeight() {
        return attendanceWeight;
    }

    public void setAttendanceWeight(double attendanceWeight) {
        this.attendanceWeight = attendanceWeight;
    }

    public double getPlacementWeight() {
        return placementWeight;
    }

    public void setPlacementWeight(double placementWeight) {
        this.placementWeight = placementWeight;
    }

    public double getSkillsWeight() {
        return skillsWeight;
    }

    public void setSkillsWeight(double skillsWeight) {
        this.skillsWeight = skillsWeight;
    }
}
