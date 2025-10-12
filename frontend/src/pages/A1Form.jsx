import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Save, Shield, AlertCircle, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './A1Form.module.css';

const A1Form = ({updateAuthState}) => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);

  const [formData, setFormData] = useState({
    // Personal Identification
    alienRegistrationNumber: '',
    socialSecurityNumber: '',
    uscisOnlineAccountNumber: '',
    
    // Full Legal Name
    lastName: '',
    firstName: '',
    middleName: '',
    
    // Other Information
    otherNamesUsed: '',
    
    // Addresses
    physicalAddress: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      phoneNumber: ''
    },
    mailingAddress: {
      sameAsPhysical: true,
      street: '',
      city: '',
      state: '',
      zipCode: ''
    },
    
    // Personal Details
    sex: '',
    maritalStatus: '',
    dateOfBirth: '',
    birthCity: '',
    birthCountry: '',
    presentNationality: '',
    nationalityAtBirth: '',
    raceEthnicGroup: '',
    religion: '',
    
    // Immigration Status
    courtProceedingsStatus: '',
    lastDepartureDate: '',
    i94Number: '',
    usEntries: [{ date: '', place: '', status: '' }],
    
    // Travel Documents
    passportIssuingCountry: '',
    passportNumber: '',
    passportExpirationDate: '',
    
    // Languages
    nativeLanguage: '',
    nativeDialect: '',
    englishFluency: '',
    otherLanguages: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');
  const [submissionId, setSubmissionId] = useState(null);

  const autoSave = useCallback(async () => {
    try {
      const token = localStorage.getItem('onboardingToken') || localStorage.getItem('token');
      const config = {
        headers: { 'x-auth-token': token }
      };

      const completedSteps = Array.from({ length: currentStep + 1 }, (_, i) => i);
      const response = await axios.post('http://localhost:5000/api/forms/save', {
        formType: 'A1',
        formData: {
          ...formData,
          totalSteps: formSteps.length
        },
        currentStep,
        completedSteps
      }, config);

      setSubmissionId(response.data.submission.id);
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus(''), 2000);
      
    } catch (error) {
      console.error('Auto-save error:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus(''), 2000);
    }
  }, [formData, currentStep]);

  // Form validation rules
  const validationRules = {
    alienRegistrationNumber: {
      pattern: /^A[0-9]{8}$/,
      message: 'Must be format A12345678'
    },
    socialSecurityNumber: {
      pattern: /^[0-9]{3}-?[0-9]{2}-?[0-9]{4}$/,
      message: 'Must be format XXX-XX-XXXX'
    },
    lastName: {
      required: true,
      message: 'Last name is required'
    },
    firstName: {
      required: true,
      message: 'First name is required'
    },
    dateOfBirth: {
      required: true,
      message: 'Date of birth is required'
    },
    sex: {
      required: true,
      message: 'Sex is required'
    }
  };

  // Form steps configuration
  const formSteps = [
    {
      title: 'Personal Identification',
      description: 'Government-issued identification numbers',
      fields: ['alienRegistrationNumber', 'socialSecurityNumber', 'uscisOnlineAccountNumber']
    },
    {
      title: 'Legal Name',
      description: 'Your full legal name as it appears on official documents',
      fields: ['lastName', 'firstName', 'middleName', 'otherNamesUsed']
    },
    {
      title: 'Contact Information',
      description: 'Your current address and phone number',
      fields: ['physicalAddress', 'mailingAddress']
    },
    {
      title: 'Personal Details',
      description: 'Basic personal information',
      fields: ['sex', 'maritalStatus', 'dateOfBirth', 'birthCity', 'birthCountry']
    },
    {
      title: 'Nationality & Background',
      description: 'Citizenship and cultural background',
      fields: ['presentNationality', 'nationalityAtBirth', 'raceEthnicGroup', 'religion']
    },
    {
      title: 'Immigration Status',
      description: 'Current immigration proceedings and history',
      fields: ['courtProceedingsStatus', 'lastDepartureDate', 'i94Number', 'usEntries']
    },
    {
      title: 'Travel Documents',
      description: 'Passport and travel document information',
      fields: ['passportIssuingCountry', 'passportNumber', 'passportExpirationDate']
    },
    {
      title: 'Languages',
      description: 'Language abilities and preferences',
      fields: ['nativeLanguage', 'nativeDialect', 'englishFluency', 'otherLanguages']
    }
  ];

  // Handle input changes
  const handleInputChange = (field, value, nested = null) => {
    setFormData(prev => {
      if (nested) {
        return {
          ...prev,
          [nested]: {
            ...prev[nested],
            [field]: value
          }
        };
      }
      return {
        ...prev,
        [field]: value
      };
    });

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  // Validate current step
  const validateStep = (stepIndex) => {
    const step = formSteps[stepIndex];
    const stepErrors = {};

    step.fields.forEach(field => {
      const rule = validationRules[field];
      if (!rule) return;

      const value = formData[field];

      if (rule.required && (!value || value.trim() === '')) {
        stepErrors[field] = rule.message;
      } else if (rule.pattern && value && !rule.pattern.test(value)) {
        stepErrors[field] = rule.message;
      }
    });

    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  // Navigation handlers
  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, formSteps.length - 1));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  useEffect(() => {
    const interval = setInterval(autoSave, 30000);
    return () => clearInterval(interval);
  }, [autoSave]);

  const handleManualSave = async () => {
    setSaveStatus('saving');
    await autoSave();
  };

  // Submit form
  const handleSubmit = async () => {
    if (!validateStep(currentStep)) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      const token = localStorage.getItem('onboardingToken') || localStorage.getItem('token');
      const config = {
        headers: { 'x-auth-token': token }
      };

      const response = await axios.post('http://localhost:5000/api/forms/submit', {
        formType: 'A1',
        formData: {
          ...formData,
          submissionDate: new Date().toISOString()
        }
      }, config);

      // Clear onboarding token if account was activated
      if (response.data.accountActivated) {
        localStorage.removeItem('onboardingToken');
        
        // Update auth state to trigger re-authentication
        updateAuthState({
          isOnboarding: false,
          isAuthenticated: false // Will trigger login flow
        });
        
        // Show success message and redirect to login
        alert('Onboarding completed successfully! Please log in to access your dashboard.');
        navigate('/login');
      } else {
        navigate('/dashboard');
      }

    } catch (error) {
      console.error('Form submission error:', error);
      alert('Failed to submit form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };


  const saveProgress = async () => {
    try {
      setSaveStatus('saving');
      // TODO: Implement API call to save progress
      // await api.post('/forms/save-progress', formData);
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus(''), 2000);
    } catch (error) {
      setSaveStatus('error');
      console.error('Save error:', error);
    }
  };

  // Add US Entry
  const addUSEntry = () => {
    setFormData(prev => ({
      ...prev,
      usEntries: [...prev.usEntries, { date: '', place: '', status: '' }]
    }));
  };

  // Remove US Entry
  const removeUSEntry = (index) => {
    setFormData(prev => ({
      ...prev,
      usEntries: prev.usEntries.filter((_, i) => i !== index)
    }));
  };

  const currentStepData = formSteps[currentStep];
  const progress = ((currentStep + 1) / formSteps.length) * 100;

  return (
    <div className={styles.formContainer}>
      {/* Form progress header */}
      <div className={styles.progressHeader}>
        <div className={styles.progressBar}>
          <div 
            className={styles.progressFill} 
            style={{ width: `${((currentStep + 1) / formSteps.length) * 100}%` }}
          />
        </div>
        <div className={styles.stepInfo}>
          <span>Step {currentStep + 1} of {formSteps.length}</span>
          <span className={styles.saveStatus}>
            {saveStatus === 'saving' && <><Save size={16} /> Saving...</>}
            {saveStatus === 'saved' && <><Check size={16} className="text-success" /> Saved</>}
            {saveStatus === 'error' && <><AlertCircle size={16} className="text-danger" /> Save failed</>}
          </span>
        </div>
      </div>

      {/* Current step content */}
      <div className={styles.stepContent}>
        <div className={styles.stepHeader}>
          <Shield className={styles.securityIcon} />
          <h2>{formSteps[currentStep].title}</h2>
          <p className={styles.stepDescription}>
            {formSteps[currentStep].description}
          </p>
        </div>

        {/* Render current step fields - implement based on your existing A1Form logic */}
        <div className={styles.fieldsContainer}>
          {/* {renderCurrentStepFields()} */}
        </div>
      </div>

      {/* Navigation and save controls */}
      <div className={styles.formActions}>
        <div className={styles.navigationButtons}>
          <button 
            onClick={prevStep} 
            disabled={currentStep === 0}
            className="btn btn-outline-secondary"
          >
            <ChevronLeft size={16} /> Previous
          </button>
          
          <button 
            onClick={handleManualSave}
            className="btn btn-outline-primary"
            disabled={saveStatus === 'saving'}
          >
            <Save size={16} /> Save Progress
          </button>
          
          {currentStep < formSteps.length - 1 ? (
            <button 
              onClick={nextStep}
              className="btn btn-primary"
            >
              Next <ChevronRight size={16} />
            </button>
          ) : (
            <button 
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="btn btn-success"
            >
              {isSubmitting ? (
                <>
                  <div className="spinner-border spinner-border-sm me-2" />
                  Submitting...
                </>
              ) : (
                'Complete Onboarding'
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};



// Input Component with proper accessibility
const FormInput = ({ 
  label, 
  value, 
  onChange, 
  error, 
  type = 'text', 
  placeholder, 
  required = false,
  maxLength,
  pattern,
  helpText,
  sensitive = false
}) => {
  const inputId = `input-${label.toLowerCase().replace(/\s+/g, '-')}`;
  
  return (
    <div className="space-y-2">
      <label 
        htmlFor={inputId}
        className="block text-sm font-medium text-gray-700"
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
        {sensitive && (
          <span className="inline-flex items-center ml-2 px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded">
            <Shield className="w-3 h-3 mr-1" />
            Sensitive
          </span>
        )}
      </label>
      
      <input
        id={inputId}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        pattern={pattern}
        required={required}
        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          error ? 'border-red-500' : 'border-gray-300'
        } ${sensitive ? 'bg-yellow-50' : 'bg-white'}`}
        aria-describedby={error ? `${inputId}-error` : helpText ? `${inputId}-help` : undefined}
      />
      
      {helpText && (
        <p id={`${inputId}-help`} className="text-sm text-gray-500">
          {helpText}
        </p>
      )}
      
      {error && (
        <p id={`${inputId}-error`} className="text-sm text-red-600 flex items-center">
          <AlertCircle className="w-4 h-4 mr-1" />
          {error}
        </p>
      )}
    </div>
  );
};

// Select Component
const FormSelect = ({ label, value, onChange, options, error, required = false }) => {
  const selectId = `select-${label.toLowerCase().replace(/\s+/g, '-')}`;
  
  return (
    <div className="space-y-2">
      <label htmlFor={selectId} className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      <select
        id={selectId}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          error ? 'border-red-500' : 'border-gray-300'
        }`}
        aria-describedby={error ? `${selectId}-error` : undefined}
      >
        <option value="">Select an option</option>
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      
      {error && (
        <p id={`${selectId}-error`} className="text-sm text-red-600 flex items-center">
          <AlertCircle className="w-4 h-4 mr-1" />
          {error}
        </p>
      )}
    </div>
  );
};

// Step Components
const PersonalIdentificationStep = ({ formData, errors, onChange }) => (
  <div className="grid grid-cols-1 gap-6">
    <FormInput
      label="Alien Registration Number (A-Number)"
      value={formData.alienRegistrationNumber}
      onChange={(value) => onChange('alienRegistrationNumber', value)}
      error={errors.alienRegistrationNumber}
      placeholder="A12345678"
      helpText="If you have been assigned an A-Number by USCIS, enter it here"
      sensitive={true}
    />
    
    <FormInput
      label="U.S. Social Security Number"
      value={formData.socialSecurityNumber}
      onChange={(value) => onChange('socialSecurityNumber', value)}
      error={errors.socialSecurityNumber}
      placeholder="XXX-XX-XXXX"
      helpText="Enter your Social Security Number if you have one"
      sensitive={true}
    />
    
    <FormInput
      label="USCIS Online Account Number"
      value={formData.uscisOnlineAccountNumber}
      onChange={(value) => onChange('uscisOnlineAccountNumber', value)}
      error={errors.uscisOnlineAccountNumber}
      helpText="If you have created an online account with USCIS"
      sensitive={true}
    />
  </div>
);

const LegalNameStep = ({ formData, errors, onChange }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <FormInput
        label="Last Name (Family Name)"
        value={formData.lastName}
        onChange={(value) => onChange('lastName', value)}
        error={errors.lastName}
        required={true}
        placeholder="Smith"
      />
      
      <FormInput
        label="First Name (Given Name)"
        value={formData.firstName}
        onChange={(value) => onChange('firstName', value)}
        error={errors.firstName}
        required={true}
        placeholder="John"
      />
      
      <FormInput
        label="Middle Name"
        value={formData.middleName}
        onChange={(value) => onChange('middleName', value)}
        error={errors.middleName}
        placeholder="Michael"
      />
    </div>
    
    <FormInput
      label="Other Names Used"
      value={formData.otherNamesUsed}
      onChange={(value) => onChange('otherNamesUsed', value)}
      error={errors.otherNamesUsed}
      placeholder="Maiden names, aliases, or other names you have used"
      helpText="Include any maiden names, aliases, or other names you have used"
    />
  </div>
);

const ContactInformationStep = ({ formData, errors, onChange }) => (
  <div className="space-y-6">
    <div>
      <h3 className="text-lg font-medium text-gray-900 mb-4">Physical Address in the U.S.</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <FormInput
            label="Street Address"
            value={formData.physicalAddress.street}
            onChange={(value) => onChange('street', value, 'physicalAddress')}
            placeholder="123 Main Street, Apt 4B"
            required={true}
          />
        </div>
        
        <FormInput
          label="City"
          value={formData.physicalAddress.city}
          onChange={(value) => onChange('city', value, 'physicalAddress')}
          placeholder="New York"
          required={true}
        />
        
        <FormInput
          label="State"
          value={formData.physicalAddress.state}
          onChange={(value) => onChange('state', value, 'physicalAddress')}
          placeholder="NY"
          required={true}
        />
        
        <FormInput
          label="ZIP Code"
          value={formData.physicalAddress.zipCode}
          onChange={(value) => onChange('zipCode', value, 'physicalAddress')}
          placeholder="10001"
          required={true}
        />
        
        <FormInput
          label="Phone Number"
          value={formData.physicalAddress.phoneNumber}
          onChange={(value) => onChange('phoneNumber', value, 'physicalAddress')}
          placeholder="(555) 123-4567"
          type="tel"
        />
      </div>
    </div>
    
    <div>
      <h3 className="text-lg font-medium text-gray-900 mb-4">Mailing Address</h3>
      <div className="mb-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={formData.mailingAddress.sameAsPhysical}
            onChange={(e) => onChange('sameAsPhysical', e.target.checked, 'mailingAddress')}
            className="mr-2"
          />
          Same as physical address
        </label>
      </div>
      
      {!formData.mailingAddress.sameAsPhysical && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <FormInput
              label="Street Address"
              value={formData.mailingAddress.street}
              onChange={(value) => onChange('street', value, 'mailingAddress')}
              placeholder="123 Main Street, Apt 4B"
            />
          </div>
          
          <FormInput
            label="City"
            value={formData.mailingAddress.city}
            onChange={(value) => onChange('city', value, 'mailingAddress')}
            placeholder="New York"
          />
          
          <FormInput
            label="State"
            value={formData.mailingAddress.state}
            onChange={(value) => onChange('state', value, 'mailingAddress')}
            placeholder="NY"
          />
          
          <FormInput
            label="ZIP Code"
            value={formData.mailingAddress.zipCode}
            onChange={(value) => onChange('zipCode', value, 'mailingAddress')}
            placeholder="10001"
          />
        </div>
      )}
    </div>
  </div>
);

const PersonalDetailsStep = ({ formData, errors, onChange }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <FormSelect
      label="Sex"
      value={formData.sex}
      onChange={(value) => onChange('sex', value)}
      error={errors.sex}
      required={true}
      options={[
        { value: 'male', label: 'Male' },
        { value: 'female', label: 'Female' }
      ]}
    />
    
    <FormSelect
      label="Marital Status"
      value={formData.maritalStatus}
      onChange={(value) => onChange('maritalStatus', value)}
      options={[
        { value: 'single', label: 'Single' },
        { value: 'married', label: 'Married' },
        { value: 'divorced', label: 'Divorced' },
        { value: 'widowed', label: 'Widowed' },
        { value: 'separated', label: 'Separated' }
      ]}
    />
    
    <FormInput
      label="Date of Birth"
      value={formData.dateOfBirth}
      onChange={(value) => onChange('dateOfBirth', value)}
      error={errors.dateOfBirth}
      type="date"
      required={true}
    />
    
    <FormInput
      label="City of Birth"
      value={formData.birthCity}
      onChange={(value) => onChange('birthCity', value)}
      placeholder="Mexico City"
    />
    
    <FormInput
      label="Country of Birth"
      value={formData.birthCountry}
      onChange={(value) => onChange('birthCountry', value)}
      placeholder="Mexico"
    />
  </div>
);

const NationalityBackgroundStep = ({ formData, errors, onChange }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <FormInput
      label="Present Nationality (Citizenship)"
      value={formData.presentNationality}
      onChange={(value) => onChange('presentNationality', value)}
      placeholder="Mexican"
    />
    
    <FormInput
      label="Nationality at Birth"
      value={formData.nationalityAtBirth}
      onChange={(value) => onChange('nationalityAtBirth', value)}
      placeholder="Mexican"
    />
    
    <FormInput
      label="Race, Ethnic, or Tribal Group"
      value={formData.raceEthnicGroup}
      onChange={(value) => onChange('raceEthnicGroup', value)}
      placeholder="Hispanic/Latino"
    />
    
    <FormInput
      label="Religion"
      value={formData.religion}
      onChange={(value) => onChange('religion', value)}
      placeholder="Catholic"
    />
  </div>
);

const ImmigrationStatusStep = ({ formData, errors, onChange, addUSEntry, removeUSEntry }) => (
  <div className="space-y-6">
    <FormSelect
      label="Immigration Court Proceedings Status"
      value={formData.courtProceedingsStatus}
      onChange={(value) => onChange('courtProceedingsStatus', value)}
      options={[
        { value: 'a', label: 'a. I am in removal proceedings' },
        { value: 'b', label: 'b. I am not in removal proceedings' },
        { value: 'c', label: 'c. I have been in removal proceedings but they are completed' }
      ]}
    />
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormInput
        label="Date of Last Departure from Country"
        value={formData.lastDepartureDate}
        onChange={(value) => onChange('lastDepartureDate', value)}
        type="date"
      />
      
      <FormInput
        label="Current I-94 Number"
        value={formData.i94Number}
        onChange={(value) => onChange('i94Number', value)}
        placeholder="12345678901"
        helpText="11-digit number from your I-94 arrival/departure record"
      />
    </div>
    
    <div>
      <h3 className="text-lg font-medium text-gray-900 mb-4">U.S. Entries</h3>
      {formData.usEntries.map((entry, index) => (
        <div key={index} className="border border-gray-200 rounded-md p-4 mb-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <FormInput
              label="Date of Entry"
              value={entry.date}
              onChange={(value) => {
                const newEntries = [...formData.usEntries];
                newEntries[index].date = value;
                onChange('usEntries', newEntries);
              }}
              type="date"
            />
            
            <FormInput
              label="Place of Entry"
              value={entry.place}
              onChange={(value) => {
                const newEntries = [...formData.usEntries];
                newEntries[index].place = value;
                onChange('usEntries', newEntries);
              }}
              placeholder="JFK Airport, New York"
            />
            
            <FormInput
              label="Status"
              value={entry.status}
              onChange={(value) => {
                const newEntries = [...formData.usEntries];
                newEntries[index].status = value;
                onChange('usEntries', newEntries);
              }}
              placeholder="B-2 Tourist"
            />
          </div>
          
          {formData.usEntries.length > 1 && (
            <button
              onClick={() => removeUSEntry(index)}
              className="text-red-600 hover:text-red-800 text-sm"
            >
              Remove Entry
            </button>
          )}
        </div>
      ))}
      
      <button
        onClick={addUSEntry}
        className="px-4 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50"
      >
        Add Another Entry
      </button>
    </div>
  </div>
);

const TravelDocumentsStep = ({ formData, errors, onChange }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <FormInput
      label="Country Issuing Last Passport or Travel Document"
      value={formData.passportIssuingCountry}
      onChange={(value) => onChange('passportIssuingCountry', value)}
      placeholder="Mexico"
    />
    
    <FormInput
      label="Passport or Travel Document Number"
      value={formData.passportNumber}
      onChange={(value) => onChange('passportNumber', value)}
      placeholder="A12345678"
      sensitive={true}
    />
    
    <FormInput
      label="Expiration Date of Travel Document"
      value={formData.passportExpirationDate}
      onChange={(value) => onChange('passportExpirationDate', value)}
      type="date"
    />
  </div>
);

const LanguagesStep = ({ formData, errors, onChange }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormInput
        label="Native Language"
        value={formData.nativeLanguage}
        onChange={(value) => onChange('nativeLanguage', value)}
        placeholder="Spanish"
      />
      
      <FormInput
        label="Native Dialect"
        value={formData.nativeDialect}
        onChange={(value) => onChange('nativeDialect', value)}
        placeholder="Castilian Spanish"
        helpText="Specify dialect or regional variation if applicable"
      />
    </div>
    
    <FormSelect
      label="Fluency in English"
      value={formData.englishFluency}
      onChange={(value) => onChange('englishFluency', value)}
      options={[
        { value: 'fluent', label: 'Fluent' },
        { value: 'good', label: 'Good' },
        { value: 'fair', label: 'Fair' },
        { value: 'poor', label: 'Poor' },
        { value: 'none', label: 'None' }
      ]}
    />
    
    <FormInput
      label="Other Languages Spoken Fluently"
      value={formData.otherLanguages}
      onChange={(value) => onChange('otherLanguages', value)}
      placeholder="French, Portuguese"
      helpText="List any other languages you speak fluently, separated by commas"
    />
  </div>
);

export default A1Form;