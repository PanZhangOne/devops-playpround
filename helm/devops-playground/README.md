# devops-playground Helm Chart

这个 Chart 会部署：

- `frontend`
- `backend`
- `postgres`
- `Ingress`

## 安装

```bash
helm upgrade --install devops-playground ./helm/devops-playground \
  --namespace devops-playground \
  --create-namespace
```

## Minikube

如果你在 macOS 上用的是 `minikube` 的 `docker` driver，优先用：

```bash
minikube addons enable ingress
helm upgrade --install devops-playground ./helm/devops-playground \
  --namespace devops-playground \
  --create-namespace
minikube service ingress-nginx-controller -n ingress-nginx --url
```

或者直接：

```bash
kubectl port-forward -n devops-playground svc/devops-playground-devops-playground-frontend 8080:80
```

## 自定义镜像

```bash
helm upgrade --install devops-playground ./helm/devops-playground \
  --namespace devops-playground \
  --create-namespace \
  --set frontend.image.repository=zhangpan1/devops-playground-frontend \
  --set backend.image.repository=zhangpan1/devops-playground-backend \
  --set frontend.image.tag=latest \
  --set backend.image.tag=latest
```

## 覆盖数据库配置

```bash
helm upgrade --install devops-playground ./helm/devops-playground \
  --namespace devops-playground \
  --create-namespace \
  --set postgres.auth.username=app_user \
  --set postgres.auth.password=strong-password \
  --set postgres.auth.database=app_db
```

## 使用外部数据库

```bash
helm upgrade --install devops-playground ./helm/devops-playground \
  --namespace devops-playground \
  --create-namespace \
  --set postgres.enabled=false \
  --set externalDatabase.enabled=true \
  --set externalDatabase.url='postgres://user:password@db.example.com:5432/app_db'
```
