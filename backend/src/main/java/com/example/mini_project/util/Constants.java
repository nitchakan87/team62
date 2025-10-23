package com.example.mini_project.util;

import lombok.experimental.UtilityClass;

import java.util.List;
@UtilityClass
public class Constants {

    public static final List<String> LOAN_PURPOSE_LIST = List.of(
            "education",
            "home",
            "car",
            "business",
            "personal"
    );
}
