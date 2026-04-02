{{- define "devops-playground.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" -}}
{{- end -}}

{{- define "devops-playground.fullname" -}}
{{- if .Values.fullnameOverride -}}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" -}}
{{- else -}}
{{- printf "%s-%s" .Release.Name (include "devops-playground.name" .) | trunc 63 | trimSuffix "-" -}}
{{- end -}}
{{- end -}}

{{- define "devops-playground.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" -}}
{{- end -}}

{{- define "devops-playground.labels" -}}
helm.sh/chart: {{ include "devops-playground.chart" . }}
app.kubernetes.io/name: {{ include "devops-playground.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
app.kubernetes.io/part-of: devops-playground
{{- end -}}

{{- define "devops-playground.selectorLabels" -}}
app.kubernetes.io/name: {{ include "devops-playground.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end -}}

{{- define "devops-playground.frontendLabels" -}}
{{ include "devops-playground.selectorLabels" . }}
app.kubernetes.io/component: frontend
{{- end -}}

{{- define "devops-playground.backendLabels" -}}
{{ include "devops-playground.selectorLabels" . }}
app.kubernetes.io/component: backend
{{- end -}}

{{- define "devops-playground.postgresLabels" -}}
{{ include "devops-playground.selectorLabels" . }}
app.kubernetes.io/component: postgres
{{- end -}}

{{- define "devops-playground.frontendServiceName" -}}
{{- printf "%s-frontend" (include "devops-playground.fullname" .) | trunc 63 | trimSuffix "-" -}}
{{- end -}}

{{- define "devops-playground.backendServiceName" -}}
{{- printf "%s-backend" (include "devops-playground.fullname" .) | trunc 63 | trimSuffix "-" -}}
{{- end -}}

{{- define "devops-playground.postgresServiceName" -}}
{{- printf "%s-postgres" (include "devops-playground.fullname" .) | trunc 63 | trimSuffix "-" -}}
{{- end -}}

{{- define "devops-playground.postgresPvcName" -}}
{{- printf "%s-postgres-data" (include "devops-playground.fullname" .) | trunc 63 | trimSuffix "-" -}}
{{- end -}}

{{- define "devops-playground.secretName" -}}
{{- printf "%s-secrets" (include "devops-playground.fullname" .) | trunc 63 | trimSuffix "-" -}}
{{- end -}}

{{- define "devops-playground.databaseUrl" -}}
{{- if .Values.externalDatabase.enabled -}}
{{- required "externalDatabase.url is required when externalDatabase.enabled=true" .Values.externalDatabase.url -}}
{{- else -}}
{{- printf "postgres://%s:%s@%s:5432/%s" .Values.postgres.auth.username .Values.postgres.auth.password (include "devops-playground.postgresServiceName" .) .Values.postgres.auth.database -}}
{{- end -}}
{{- end -}}
