const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const QualificationsMarks = sequelize.define('QualificationsMarks', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  
  // Educational Qualifications
  highest_education: {
    type: DataTypes.ENUM('high_school', 'diploma', 'bachelor', 'master', 'phd', 'professional_certification'),
    allowNull: false
  },
  education_details: {
    type: DataTypes.JSON,
    defaultValue: {
      degree: '',
      field_of_study: '',
      institution: '',
      completion_year: null,
      grade_percentage: null,
      cgpa: null
    }
  },
  additional_qualifications: {
    type: DataTypes.JSON,
    defaultValue: [],
    comment: 'Array of additional certifications, courses, etc.'
  },
  
  // Academic Performance
  academic_score: {
    type: DataTypes.DECIMAL(5, 2),
    defaultValue: 0.00,
    validate: {
      min: 0,
      max: 100
    }
  },
  academic_performance_level: {
    type: DataTypes.ENUM('excellent', 'very_good', 'good', 'average', 'below_average'),
    defaultValue: 'average'
  },
  
  // Professional Qualifications
  professional_certifications: {
    type: DataTypes.JSON,
    defaultValue: [],
    comment: 'Array of professional certifications'
  },
  work_experience_years: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  industry_experience: {
    type: DataTypes.JSON,
    defaultValue: [],
    comment: 'Array of industries worked in'
  },
  
  // Skills and Competencies
  technical_skills: {
    type: DataTypes.JSON,
    defaultValue: [],
    comment: 'Array of technical skills'
  },
  soft_skills: {
    type: DataTypes.JSON,
    defaultValue: [],
    comment: 'Array of soft skills'
  },
  languages_known: {
    type: DataTypes.JSON,
    defaultValue: [],
    comment: 'Array of languages with proficiency levels'
  },
  
  // Achievement Marks
  academic_achievements: {
    type: DataTypes.JSON,
    defaultValue: [],
    comment: 'Array of academic achievements, awards, etc.'
  },
  professional_achievements: {
    type: DataTypes.JSON,
    defaultValue: [],
    comment: 'Array of professional achievements, awards, etc.'
  },
  extracurricular_achievements: {
    type: DataTypes.JSON,
    defaultValue: [],
    comment: 'Array of extracurricular achievements'
  },
  
  // Verification Status
  education_verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  certificates_verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  experience_verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  verification_documents: {
    type: DataTypes.JSON,
    defaultValue: [],
    comment: 'Array of uploaded verification documents'
  },
  
  // Scoring System
  qualification_score: {
    type: DataTypes.DECIMAL(5, 2),
    defaultValue: 0.00,
    validate: {
      min: 0,
      max: 100
    }
  },
  experience_score: {
    type: DataTypes.DECIMAL(5, 2),
    defaultValue: 0.00,
    validate: {
      min: 0,
      max: 100
    }
  },
  skills_score: {
    type: DataTypes.DECIMAL(5, 2),
    defaultValue: 0.00,
    validate: {
      min: 0,
      max: 100
    }
  },
  achievements_score: {
    type: DataTypes.DECIMAL(5, 2),
    defaultValue: 0.00,
    validate: {
      min: 0,
      max: 100
    }
  },
  verification_score: {
    type: DataTypes.DECIMAL(5, 2),
    defaultValue: 0.00,
    validate: {
      min: 0,
      max: 100
    }
  },
  
  // Overall Marks
  total_marks: {
    type: DataTypes.DECIMAL(5, 2),
    defaultValue: 0.00,
    validate: {
      min: 0,
      max: 100
    }
  },
  marks_percentage: {
    type: DataTypes.DECIMAL(5, 2),
    defaultValue: 0.00,
    validate: {
      min: 0,
      max: 100
    }
  },
  
  // Search and Filter Criteria
  search_visibility: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  minimum_marks_requirement: {
    type: DataTypes.DECIMAL(5, 2),
    defaultValue: 0.00,
    comment: 'Minimum marks required for search visibility'
  },
  preferred_qualifications: {
    type: DataTypes.JSON,
    defaultValue: [],
    comment: 'Array of preferred qualifications for matching'
  },
  
  // Assessment and Reviews
  self_assessment: {
    type: DataTypes.JSON,
    defaultValue: {
      academic_confidence: 0,
      professional_confidence: 0,
      skills_confidence: 0,
      overall_confidence: 0
    }
  },
  peer_reviews: {
    type: DataTypes.JSON,
    defaultValue: [],
    comment: 'Array of peer reviews and ratings'
  },
  expert_assessments: {
    type: DataTypes.JSON,
    defaultValue: [],
    comment: 'Array of expert assessments'
  },
  
  // Updates and Maintenance
  last_updated: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  update_frequency: {
    type: DataTypes.ENUM('monthly', 'quarterly', 'yearly', 'on_demand'),
    defaultValue: 'yearly'
  },
  next_update_due: {
    type: DataTypes.DATE
  },
  
  // Metadata
  calculation_version: {
    type: DataTypes.STRING(20),
    defaultValue: '1.0'
  },
  scoring_algorithm: {
    type: DataTypes.STRING(50),
    defaultValue: 'standard'
  },
  
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'qualifications_marks',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      fields: ['total_marks']
    },
    {
      fields: ['qualification_score']
    },
    {
      fields: ['experience_score']
    },
    {
      fields: ['search_visibility']
    }
  ]
});

// Instance methods
QualificationsMarks.prototype.calculateQualificationScore = async function() {
  let score = 0;
  
  // Education level scoring (max 40 points)
  const educationScores = {
    'high_school': 10,
    'diploma': 20,
    'bachelor': 30,
    'master': 35,
    'phd': 40,
    'professional_certification': 25
  };
  
  score += educationScores[this.highest_education] || 0;
  
  // Academic performance scoring (max 20 points)
  if (this.academic_performance_level === 'excellent') score += 20;
  else if (this.academic_performance_level === 'very_good') score += 16;
  else if (this.academic_performance_level === 'good') score += 12;
  else if (this.academic_performance_level === 'average') score += 8;
  else if (this.academic_performance_level === 'below_average') score += 4;
  
  // Additional qualifications (max 20 points)
  const additionalQuals = this.additional_qualifications.length;
  score += Math.min(20, additionalQuals * 2);
  
  // Academic achievements (max 20 points)
  const achievements = this.academic_achievements.length;
  score += Math.min(20, achievements * 4);
  
  await this.update({
    qualification_score: Math.min(100, score),
    last_updated: new Date()
  });
  
  return score;
};

QualificationsMarks.prototype.calculateExperienceScore = async function() {
  let score = 0;
  
  // Work experience scoring (max 50 points)
  const experienceYears = this.work_experience_years;
  if (experienceYears >= 10) score += 50;
  else if (experienceYears >= 7) score += 40;
  else if (experienceYears >= 5) score += 30;
  else if (experienceYears >= 3) score += 20;
  else if (experienceYears >= 1) score += 10;
  
  // Professional certifications (max 30 points)
  const certifications = this.professional_certifications.length;
  score += Math.min(30, certifications * 5);
  
  // Industry experience diversity (max 20 points)
  const industries = this.industry_experience.length;
  score += Math.min(20, industries * 4);
  
  await this.update({
    experience_score: Math.min(100, score),
    last_updated: new Date()
  });
  
  return score;
};

QualificationsMarks.prototype.calculateSkillsScore = async function() {
  let score = 0;
  
  // Technical skills (max 40 points)
  const technicalSkills = this.technical_skills.length;
  score += Math.min(40, technicalSkills * 2);
  
  // Soft skills (max 30 points)
  const softSkills = this.soft_skills.length;
  score += Math.min(30, softSkills * 3);
  
  // Languages (max 30 points)
  const languages = this.languages_known.length;
  score += Math.min(30, languages * 6);
  
  await this.update({
    skills_score: Math.min(100, score),
    last_updated: new Date()
  });
  
  return score;
};

QualificationsMarks.prototype.calculateVerificationScore = async function() {
  let score = 0;
  
  // Education verification (25 points)
  if (this.education_verified) score += 25;
  
  // Certificates verification (25 points)
  if (this.certificates_verified) score += 25;
  
  // Experience verification (25 points)
  if (this.experience_verified) score += 25;
  
  // Document verification (25 points)
  const documents = this.verification_documents.length;
  score += Math.min(25, documents * 5);
  
  await this.update({
    verification_score: Math.min(100, score),
    last_updated: new Date()
  });
  
  return score;
};

QualificationsMarks.prototype.calculateTotalMarks = async function() {
  const weights = {
    qualification: 0.30,
    experience: 0.25,
    skills: 0.20,
    achievements: 0.15,
    verification: 0.10
  };
  
  const totalMarks = (
    this.qualification_score * weights.qualification +
    this.experience_score * weights.experience +
    this.skills_score * weights.skills +
    this.achievements_score * weights.achievements +
    this.verification_score * weights.verification
  );
  
  await this.update({
    total_marks: totalMarks,
    marks_percentage: totalMarks,
    last_updated: new Date()
  });
  
  return totalMarks;
};

QualificationsMarks.prototype.updateSearchVisibility = async function() {
  const isVisible = this.total_marks >= this.minimum_marks_requirement && this.search_visibility;
  await this.update({ search_visibility: isVisible });
  return isVisible;
};

// Class methods
QualificationsMarks.findByMarksRange = function(minMarks, maxMarks) {
  return this.findAll({
    where: {
      total_marks: {
        [require('sequelize').Op.between]: [minMarks, maxMarks]
      },
      search_visibility: true
    },
    include: ['user'],
    order: [['total_marks', 'DESC']]
  });
};

QualificationsMarks.findByEducation = function(educationLevel) {
  return this.findAll({
    where: {
      highest_education: educationLevel,
      search_visibility: true
    },
    include: ['user'],
    order: [['total_marks', 'DESC']]
  });
};

QualificationsMarks.findVerifiedProfiles = function() {
  return this.findAll({
    where: {
      education_verified: true,
      certificates_verified: true,
      experience_verified: true,
      search_visibility: true
    },
    include: ['user'],
    order: [['total_marks', 'DESC']]
  });
};

QualificationsMarks.getAverageMarks = async function() {
  const result = await this.findOne({
    attributes: [
      [require('sequelize').fn('AVG', require('sequelize').col('total_marks')), 'average_marks']
    ]
  });
  
  return parseFloat(result.dataValues.average_marks) || 0;
};

// Scopes
QualificationsMarks.addScope('highMarks', {
  where: {
    total_marks: {
      [require('sequelize').Op.gte]: 80
    },
    search_visibility: true
  }
});

QualificationsMarks.addScope('verified', {
  where: {
    education_verified: true,
    certificates_verified: true,
    experience_verified: true
  }
});

module.exports = QualificationsMarks;
