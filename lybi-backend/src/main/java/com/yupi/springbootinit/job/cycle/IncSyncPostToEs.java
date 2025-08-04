package com.yupi.springbootinit.job.cycle;

import com.yupi.springbootinit.esdao.PostEsDao;
import com.yupi.springbootinit.mapper.PostMapper;
import com.yupi.springbootinit.model.dto.post.PostEsDTO;
import com.yupi.springbootinit.model.entity.Post;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import static cn.hutool.core.collection.CollUtil.isEmpty;

/**
 * 增量同步帖子到 es
 *
 * @author <a href="https://github.com/liyupi">程序员鱼皮</a>
 * @from <a href="https://yupi.icu">编程导航知识星球</a>
 */
@Component
@Slf4j
public class IncSyncPostToEs {

    @Resource
    private PostMapper postMapper;

    @Resource
    private PostEsDao postEsDao;

    /**
     * 每分钟执行一次
     */
    @Scheduled(fixedRate = 60 * 1000)
    @Transactional(readOnly = true)
    public void run() {
        try {
            // 查询近 5 分钟内的数据
            Date fiveMinutesAgoDate = new Date(new Date().getTime() - 5 * 60 * 1000L);
            List<Post> postList = postMapper.listPostWithDelete(fiveMinutesAgoDate);
            if (isEmpty(postList)) {
                log.info("no inc post");
                return;
            }
            List<PostEsDTO> postEsDTOList = postList.stream()
                    .map(PostEsDTO::objToDto)
                    .collect(Collectors.toList());
            final int pageSize = 500;
            int total = postEsDTOList.size();
            log.info("IncSyncPostToEs start, total {}", total);
            for (int i = 0; i < total; i += pageSize) {
                int end = Math.min(i + pageSize, total);
                log.info("sync from {} to {}", i, end);
                postEsDao.saveAll(postEsDTOList.subList(i, end));
            }
            log.info("IncSyncPostToEs end, total {}", total);
        } catch (Exception e) {
            log.error("同步帖子到 ES 失败", e);
        }
    }
}