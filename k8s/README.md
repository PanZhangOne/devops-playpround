# Kubernetes 部署说明

这套清单对应当前仓库的三个服务：

- `postgres`
- `backend`
- `frontend`

入口流量走 `Ingress -> frontend Service -> frontend Pod`，前端容器里的 Nginx 会继续把 `/api` 转发到 `backend:8080`。

## 1. 修改密钥

先修改 [secret.yaml](/Users/zhangpan/Documents/learn-project/devops-playground/k8s/secret.yaml) 里的占位值，至少包括：

- `POSTGRES_PASSWORD`
- `DATABASE_URL`

注意：`DATABASE_URL` 要和前面三个 PostgreSQL 字段保持一致。

## 2. 应用资源

```bash
kubectl apply -k k8s
```

## 3. 检查状态

```bash
kubectl get pods,svc,ingress -n devops-playground
kubectl describe pod -n devops-playground
kubectl logs -n devops-playground deploy/backend
```

## 4. 访问服务

如果集群里已经安装了 `ingress-nginx`，把 `devops-playground.local` 解析到 Ingress 对外地址即可访问。

如果你暂时没有 Ingress Controller，可以先本地转发：

```bash
kubectl port-forward -n devops-playground svc/frontend 8080:80
```

然后访问 `http://127.0.0.1:8080`。

## 5. GHCR 私有镜像

如果 `ghcr.io/panzhangone/devops-playground-backend` 或 `ghcr.io/panzhangone/devops-playground-frontend` 不是公开镜像，还要额外创建拉取密钥：

```bash
kubectl create secret docker-registry ghcr-secret \
  --namespace devops-playground \
  --docker-server=ghcr.io \
  --docker-username=<github-username> \
  --docker-password=<github-token> \
  --docker-email=<email>
```

然后在 [backend.yaml](/Users/zhangpan/Documents/learn-project/devops-playground/k8s/backend.yaml) 和 [frontend.yaml](/Users/zhangpan/Documents/learn-project/devops-playground/k8s/frontend.yaml) 的 `spec.template.spec` 下加：

```yaml
imagePullSecrets:
  - name: ghcr-secret
```

## 6. 生产环境建议

这套配置适合当前仓库演示和单集群部署。真生产环境建议把 PostgreSQL 换成托管数据库，k8s 里只保留 `backend`、`frontend` 和入口层。
