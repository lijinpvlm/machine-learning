#!/usr/bin/python

## @session_base.py
#  This file serves as the superclass for other 'session_xx_xx.py' files.
#
#  Note: the term 'dataset' used throughout various comments in this file,
#        synonymously implies the user supplied 'file upload(s)', and XML url
#        references.
import sys, json
from validator.validator_settings import Validate_Settings

## Class: Session_Base
class Session_Base:

  ## constructor:
  def __init__(self, svm_data):
    self.svm_data       = svm_data
    self.svm_session    = json.loads(self.svm_data)['data']['settings']['svm_session']
    self.response_error = []
